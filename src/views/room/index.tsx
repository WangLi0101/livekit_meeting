import React, { useEffect } from "react";
import { VideoList } from "./components/Carsule";
import { UserList } from "./components/UserList";
import { Control } from "./components/Control";
import { useLiveKit } from "@/hooks/useLiveKit";
import { livekit_url } from "@/api/config";

import { LivekitContext } from "./components/LivekitContext";
import { MainVideo } from "./components/MainVideo";
import { Message } from "./components/Message";

const Room: React.FC = () => {
  const livekit = useLiveKit();
  const {
    connect,
    createCameraTrack,
    createAudioTrack,
    startListen,
    currentCamera,
    currentMic,
  } = livekit;

  // 加入房间
  const joinRoom = async () => {
    startListen();
    await livekit.getVideoDevices();
    await livekit.getAudioDevices();
    const token = window.sessionStorage.getItem("sign");
    if (token) {
      await connect(livekit_url, token);
      createCameraTrack(currentCamera);
      createAudioTrack(currentMic);
    }
  };

  useEffect(() => {
    joinRoom();
    return () => {
      livekit.disconnect();
    };
  }, []);
  return (
    <LivekitContext.Provider value={{ livekit }}>
      <div className="room flex p-2 h-screen bg-[#e6e9ec]">
        <div className="left flex-1 h-full flex flex-col gap-4 bg-white p-4 rounded-[20px]">
          <h2 className="title text-2xl font-bold flex-shrink-0">
            roomNumber:{livekit.roomInfo?.name}
          </h2>
          <div className="video-content mt-4 flex-1 overflow-hidden">
            <MainVideo />
          </div>
          <div className="list  px-9 flex-shrink-0">
            <VideoList />
          </div>
          <div className="control flex-shrink-0 mt-4">
            <Control />
          </div>
        </div>
        <div className="right w-[25%] flex-shrink-0 ml-7 flex flex-col gap-4 h-full">
          <div className="top h-[50%] bg-white p-4 rounded-[20px]">
            <UserList />
          </div>
          <div className="message h-[50%] bg-white p-4 rounded-[20px]">
            <Message />
          </div>
        </div>
      </div>
    </LivekitContext.Provider>
  );
};

export default Room;
