import React, { useContext, useEffect } from "react";
import { Voice } from "./Voice";
import { LivekitContext } from "./LivekitContext";
import { Avatar } from "./Avatar";
import { UserName } from "./UserName";
import clsx from "clsx";

export const MainVideo: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const { mainUser } = livekit;
  useEffect(() => {
    console.log(mainUser);
    if (!mainUser) return;

    const video = document.getElementById("main_video") as HTMLVideoElement;

    const audio = document.getElementById("main_audio") as HTMLAudioElement;
    const screen = document.getElementById("main_screen") as HTMLVideoElement;

    if (video && mainUser.traks?.camera) {
      mainUser.traks.camera.track?.attach(video);
    }

    if (audio && mainUser.traks?.microphone) {
      mainUser.traks.microphone.track?.attach(audio);
    }

    if (screen && mainUser.traks?.screen_share) {
      mainUser.traks.screen_share.track?.attach(screen);
    }
  }, [mainUser]);

  return (
    <div className="w-full h-full border-2 border-[#4a9582] rounded-lg relative">
      {mainUser?.traks.camera || mainUser?.traks.screen_share ? (
        <div className="video h-full">
          <video
            id="main_video"
            className={clsx("right-0 top-0", {
              absolute: mainUser?.traks.screen_share,
              "w-1/3 h-1/3": mainUser?.traks.screen_share,
              "w-full h-full": !mainUser?.traks.screen_share,
              relative: !mainUser?.traks.screen_share,
            })}
          />
          <video id="main_screen" className="w-full h-full"></video>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Avatar className="w-[60px] h-[60px]">
            {mainUser?.name?.slice(0, 1)}
          </Avatar>
        </div>
      )}
      <audio id="main_audio" className="hidden" />
      <div className="operator w-full flex justify-between items-center absolute bottom-0 left-0 p-4">
        <UserName>{mainUser?.name}</UserName>
        <div className="voice">
          <Voice
            isMuted={mainUser?.isMuted}
            disabled={!mainUser?.traks.microphone}
          />
        </div>
      </div>
    </div>
  );
};
