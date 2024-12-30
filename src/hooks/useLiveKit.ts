import { useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalAudioTrack,
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
  traks: Partial<Record<Track.Kind, RemoteTrackPublication>>;
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
    setRoomInfo(room.current);
    getParticipants();
    console.log("链接成功", room.current);
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
        (device) => device.kind === "videoinput"
      );

      setCameraList(videoDevices);
      setCurrentCamera(videoDevices[0].deviceId);
    } catch (error) {
      console.error("Error getting video devices:", error);
      return [];
    }
  }

  // 获取所有音频设别
  async function getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    setMicList(audioDevices);
    setCurrentMic(audioDevices[0].deviceId);
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
    const res = await room.current?.localParticipant.publishTrack(track);
    console.log("res", res);
  };
  // 获取所有参与者
  const getParticipants = () => {
    if (!room.current) return;
    const arr = [];
    const remoteParticipants = room.current.remoteParticipants;
    for (const [key, value] of remoteParticipants) {
      const item = {
        name: key,
        traks: {} as Partial<Record<Track.Kind, RemoteTrackPublication>>,
      };
      for (const [_rkey, rvalue] of value.trackPublications) {
        item.traks[rvalue.kind] = rvalue;
      }
      arr.push(item);
    }
    setUserList(arr);
    if (!mainUser) {
      setMainUser(arr[0]);
    }
  };
  // 监听流
  const startListen = () => {
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
  };

  return {
    room,
    connect,
    disconnect,
    getVideoDevices,
    getAudioDevices,
    createCameraTrack,
    createAudioTrack,
    publishTrack,
    cameraTrack,
    audioTrack,
    startListen,
    roomInfo,
    cameraList,
    micList,
    currentCamera,
    currentMic,
    setCurrentCamera,
    setCurrentMic,
    userList,
    mainUser,
  };
};
