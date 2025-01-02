import React, { useEffect } from "react";
import { VideoList } from "./components/Carsule";
import { UserList } from "./components/UserList";
import { Control } from "./components/Control";
import { useLiveKit } from "@/hooks/useLiveKit";
import { livekit_url } from "@/api/config";

import { LivekitContext } from "./components/LivekitContext";
import { MainVideo } from "./components/MainVideo";
import { Message } from "./components/Message";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
      <div className="room h-screen bg-[#f2f3f5] p-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full rounded-lg"
        >
          <ResizablePanel defaultSize={75}>
            <div className="left h-full flex flex-col  bg-white p-4 rounded-[20px]">
              <h2 className="title text-[18px] leading-none font-bold flex-shrink-0 bg-[#219781] py-2 px-6 rounded-[10px] w-fit text-white">
                Room: {livekit.roomInfo?.name}
              </h2>
              <div className="video-content mt-4 flex-1 overflow-hidden mb-4">
                <MainVideo />
              </div>
              <div className="list px-[45px] flex-shrink-0 mb-6">
                <VideoList />
              </div>
              <div className="control flex-shrink-0">
                <Control />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="mx-4" />
          <ResizablePanel defaultSize={25}>
            <div className="right h-full">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  <div className="bg-white p-4 rounded-[20px] h-full">
                    <UserList />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="my-4" />
                <ResizablePanel defaultSize={50}>
                  <div className=" bg-white p-4 rounded-[20px] h-full">
                    <Message />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </LivekitContext.Provider>
  );
};

export default Room;
