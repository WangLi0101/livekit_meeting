import { useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalAudioTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useImmer } from "use-immer";
export interface User {
  name: string;
  traks: Partial<
    Record<Track.Kind, RemoteTrackPublication | LocalTrackPublication>
  >;
  isMuted: boolean;
  isMy: boolean;
}
export const useLiveKit = () => {
  const room = useRef<Room>();
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [micList, setMicList] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string>("");
  const [currentMic, setCurrentMic] = useState<string>("");
  const [roomInfo, setRoomInfo] = useState<Room>();
  const [userList, setUserList] = useImmer<User[]>([]);
  const [mainUser, setMainUser] = useState<User>();
  useEffect(() => {
    room.current = new Room();
  }, []);
  // 连接
  const connect = async (url: string, token: string) => {
    await room.current?.connect(url, token);
  };
  // 断开链接
  const disconnect = async () => {
    if (room.current?.state !== ConnectionState.Connected) return;
    await room.current?.disconnect();
    console.log("断开链接");
  };

  // 获取所有摄像头设备
  async function getVideoDevices() {
    try {
      // 获取所有设备信息
      const devices = await navigator.mediaDevices.enumerateDevices();

      // 过滤出视频输入设备（摄像头）
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput" && device.deviceId
      );
      console.log("videoDevices", videoDevices);
      setCameraList(videoDevices);
      if (videoDevices.length > 0) {
        setCurrentCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting video devices:", error);
      return [];
    }
  }

  // 获取所有音频设别
  async function getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput" && device.deviceId
    );
    setMicList(audioDevices);
    if (audioDevices.length > 0) {
      setCurrentMic(audioDevices[0].deviceId);
    }
  }

  // 摄像头轨道
  const cameraTrack = useRef<LocalVideoTrack>();
  // 音频轨道
  const audioTrack = useRef<LocalAudioTrack>();
  // 创建摄像头轨道
  const createCameraTrack = async (deviceId: string) => {
    const track = await createLocalVideoTrack({
      deviceId,
    });
    cameraTrack.current = track;
    publishTrack(cameraTrack.current);
  };
  // 创建音频轨道
  const createAudioTrack = async (deviceId: string) => {
    const track = await createLocalAudioTrack({
      deviceId,
    });
    audioTrack.current = track;
    publishTrack(audioTrack.current);
  };

  // 发布轨道
  const publishTrack = async (track: LocalVideoTrack | LocalAudioTrack) => {
    await room.current?.localParticipant.publishTrack(track);
  };
  // 获取所有参与者
  const getParticipants = () => {
    if (!room.current) return;
    const arr = [];
    const remoteParticipants = room.current.remoteParticipants;
    // 自己的信息
    const myName = room.current.localParticipant.identity;
    const localParticipant = room.current.localParticipant.trackPublications;
    const myItem: User = {
      name: myName,
      traks: {} as Partial<Record<Track.Kind, RemoteTrackPublication>>,
      isMuted: false,
      isMy: true,
    };
    for (const [_rkey, rvalue] of localParticipant) {
      myItem.traks[rvalue.kind] = rvalue;
      if (rvalue.kind === Track.Kind.Audio) {
        myItem.isMuted = rvalue.isMuted;
      }
    }
    arr.push(myItem);

    // 其他人的信息
    for (const [key, value] of remoteParticipants) {
      const item: User = {
        name: key,
        traks: {} as Partial<Record<Track.Kind, RemoteTrackPublication>>,
        isMuted: false,
        isMy: false,
      };
      for (const [_rkey, rvalue] of value.trackPublications) {
        item.traks[rvalue.kind] = rvalue;
        if (rvalue.kind === Track.Kind.Audio) {
          item.isMuted = rvalue.isMuted;
        }
      }
      arr.push(item);
    }
    setUserList(arr);
    if (!mainUser && arr.length) {
      setMainUser(arr[0]);
    }
  };

  // 监听
  const startListen = () => {
    if (!room.current) return;
    room.current?.on(
      RoomEvent.TrackSubscribed,
      (
        _track: RemoteTrack,
        _publication: RemoteTrackPublication,
        _participant: RemoteParticipant
      ) => {
        getParticipants();
      }
    );
    room.current.on(RoomEvent.Connected, () => {
      console.log("连接成功");
      getParticipants();
      setRoomInfo(room.current);
    });

    room.current.on(RoomEvent.TrackMuted, () => {
      getParticipants();
    });

    room.current.on(RoomEvent.TrackUnmuted, () => {
      getParticipants();
    });

    room.current.on(RoomEvent.LocalTrackPublished, () => {
      getParticipants();
    });

    room.current.on(RoomEvent.LocalTrackUnpublished, () => {
      getParticipants();
    });
  };

  // 静音(自己)
  const mutedLocalHandler = (isMuted: boolean) => {
    if (audioTrack.current) {
      if (isMuted) {
        audioTrack.current.mute();
      } else {
        audioTrack.current.unmute();
      }
    }
  };

  // 关闭视频
  const closeVideo = async () => {
    if (!cameraTrack.current) return;
    cameraTrack.current.stop();
    await room.current?.localParticipant.unpublishTrack(cameraTrack.current);
  };

  // 更换摄像头
  const setCamera = async (deviceId: string) => {
    if (!cameraTrack.current) return;
    cameraTrack.current.setDeviceId(deviceId);
  };

  // 更换麦克风
  const setMic = async (deviceId: string) => {
    if (!audioTrack.current) return;
    audioTrack.current.setDeviceId(deviceId);
  };
  return {
    room,
    cameraTrack,
    audioTrack,
    roomInfo,
    cameraList,
    micList,
    currentCamera,
    currentMic,
    userList,
    mainUser,

    // action
    connect,
    disconnect,
    getVideoDevices,
    getAudioDevices,
    createCameraTrack,
    createAudioTrack,
    publishTrack,
    mutedLocalHandler,
    setCamera,
    setMic,
    closeVideo,
    setMainUser,
    setCurrentCamera,
    setCurrentMic,
    startListen,
  };
};
