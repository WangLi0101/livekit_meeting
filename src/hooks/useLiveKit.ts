import { useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  createLocalAudioTrack,
  createLocalScreenTracks,
  createLocalVideoTrack,
  LocalAudioTrack,
  LocalTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useImmer } from "use-immer";
import { toast } from "sonner";
export interface User {
  name: string;
  traks: Partial<
    Record<Track.Source, RemoteTrackPublication | LocalTrackPublication>
  >;
  isMuted: boolean;
  isMy: boolean;
}
export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  isSelf: boolean;
}

const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const useLiveKit = () => {
  const room = useRef<Room>();
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [micList, setMicList] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string>("");
  const [currentMic, setCurrentMic] = useState<string>("");
  const [roomInfo, setRoomInfo] = useState<Room>();
  const [userList, setUserList] = useImmer<User[]>([]);
  const [mainUser, setMainUser] = useState<User>();
  const [my, setMy] = useState<User>();
  const [messages, setMessages] = useImmer<Message[]>([]);
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
      const videoDevices = await Room.getLocalDevices("videoinput");
      setCameraList(videoDevices);
      if (videoDevices.length > 0) {
        setCurrentCamera(videoDevices[0].deviceId);
      } else {
        toast.error("no video device");
      }
    } catch {
      toast.error("no video device");
    }
  }

  // 获取所有音频设别
  async function getAudioDevices() {
    try {
      const audioDevices = await Room.getLocalDevices("audioinput");
      setMicList(audioDevices);
      if (audioDevices.length > 0) {
        setCurrentMic(audioDevices[0].deviceId);
      } else {
        toast.error("no audio device");
      }
    } catch {
      toast.error("no audio device");
    }
  }

  // 摄像头轨道
  const cameraTrack = useRef<LocalVideoTrack>();
  // 音频轨道
  const audioTrack = useRef<LocalAudioTrack>();
  // 屏幕轨道
  const screenTrack = useRef<LocalTrack>();
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

  // 创建屏幕轨道
  const createScreenTrack = async () => {
    const track = await createLocalScreenTracks({
      audio: false,
    });
    screenTrack.current = track[0];
    publishTrack(screenTrack.current);
  };

  // 发布轨道
  const publishTrack = async (
    track: LocalVideoTrack | LocalAudioTrack | LocalTrack
  ) => {
    await room.current?.localParticipant.publishTrack(track);
  };

  // 获取所有参与者
  const getParticipants = () => {
    if (!room.current) return;
    const arr = [];

    // 自己的信息
    const myName = room.current.localParticipant.identity;
    const localParticipant = room.current.localParticipant.trackPublications;
    const myItem: User = {
      name: myName,
      traks: {} as Partial<Record<Track.Source, RemoteTrackPublication>>,
      isMuted: true,
      isMy: true,
    };
    for (const [_rkey, rvalue] of localParticipant) {
      myItem.traks[rvalue.source] = rvalue;
      if (rvalue.kind === Track.Kind.Audio) {
        myItem.isMuted = rvalue.isMuted;
      }
    }
    arr.push(myItem);
    setMy(myItem);

    // 其他人的信息
    const remoteParticipants = room.current.remoteParticipants;
    for (const [key, value] of remoteParticipants) {
      const item: User = {
        name: key,
        traks: {} as Partial<Record<Track.Kind, RemoteTrackPublication>>,
        isMuted: true,
        isMy: false,
      };
      for (const [_rkey, rvalue] of value.trackPublications) {
        item.traks[rvalue.source] = rvalue;
        if (rvalue.source === Track.Source.Microphone) {
          item.isMuted = rvalue.isMuted;
        }
      }
      arr.push(item);
    }
    setUserList(arr);
  };

  useEffect(() => {
    if (!userList.length) return;
    if (!mainUser) {
      setMainUser(userList[0]);
    } else {
      const user = userList.find((item) => item.name === mainUser?.name);
      if (user) {
        setMainUser(user);
      }
    }
  }, [userList, mainUser]);

  // 监听
  const startListen = () => {
    if (!room.current) return;
    room.current?.on(RoomEvent.TrackSubscribed, () => {
      getParticipants();
    });
    room.current.on(RoomEvent.Connected, () => {
      console.log("连接成功", room.current);
      getParticipants();
      setRoomInfo(room.current);
    });

    room.current.on(RoomEvent.LocalTrackPublished, () => {
      getParticipants();
    });

    room.current.on(RoomEvent.LocalTrackUnpublished, () => {
      getParticipants();
    });

    room.current.on(RoomEvent.TrackUnpublished, () => {
      getParticipants();
    });

    // 接收消息
    room.current.on(
      RoomEvent.DataReceived,
      (payload: Uint8Array, participant) => {
        const strData = JSON.parse(decoder.decode(payload));
        console.log("strData", strData, participant);
        setMessages((draft) => {
          draft.push({
            sender: participant!.identity,
            content: strData.message,
            timestamp: strData.timestamp,
            isSelf: participant!.identity === my?.name,
          });
        });
      }
    );
  };

  // 声音控制(自己)
  const mutedLocalHandler = (isMuted: boolean) => {
    if (!room.current) return;

    if (isMuted) {
      if (!audioTrack.current) return;
      audioTrack.current.stop();
      room.current.localParticipant.unpublishTrack(audioTrack.current);
      audioTrack.current = void 0;
    } else {
      createAudioTrack(currentMic);
    }
  };

  // 声音控制他人
  const mutedRemoteHandler = (isMuted: boolean, name: string) => {
    setUserList((draft) => {
      const user = draft.find((item) => item.name === name);
      if (!user || !user.traks.microphone) {
        return;
      }
      if (isMuted) {
        (user.traks.microphone as RemoteTrackPublication).setSubscribed(false);
        user.isMuted = true;
      } else {
        (user.traks.microphone as RemoteTrackPublication).setSubscribed(true);
        user.isMuted = false;
      }
    });
  };
  // 关闭视频
  const closeVideo = async () => {
    if (!cameraTrack.current) return;
    cameraTrack.current.stop();
    await room.current?.localParticipant.unpublishTrack(cameraTrack.current);
    cameraTrack.current = void 0;
  };
  // 关闭屏幕
  const closeScreen = async () => {
    if (!screenTrack.current) return;
    screenTrack.current.stop();
    await room.current?.localParticipant.unpublishTrack(screenTrack.current);
    screenTrack.current = void 0;
  };

  // 更换设别
  const setDevice = async (deviceId: string, kind: MediaDeviceKind) => {
    if (!room.current) return;
    await room.current.switchActiveDevice(kind, deviceId);
    switch (kind) {
      case "videoinput":
        setCurrentCamera(deviceId);
        break;
      case "audioinput":
        setCurrentMic(deviceId);
        break;
    }
  };

  // 发送消息
  const sendMessag = async (message: string) => {
    if (!room.current) return;
    const data = encoder.encode(
      JSON.stringify({ message, timestamp: new Date() })
    );
    await room.current.localParticipant.publishData(data, {
      reliable: true,
    });
    setMessages((draft) => {
      draft.push({
        sender: my?.name || "",
        content: message,
        timestamp: new Date(),
        isSelf: true,
      });
    });
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
    my,
    messages,
    // action
    connect,
    disconnect,
    getVideoDevices,
    getAudioDevices,
    createCameraTrack,
    createAudioTrack,
    publishTrack,
    mutedLocalHandler,
    closeVideo,
    setMainUser,
    setCurrentCamera,
    setCurrentMic,
    startListen,
    mutedRemoteHandler,
    createScreenTrack,
    closeScreen,
    setDevice,
    sendMessag,
  };
};
