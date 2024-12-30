import React, { useContext, useEffect } from "react";
import { Voice } from "./Voice";
import { LivekitContext } from "./LivekitContext";

export const MainVideo: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const { mainUser } = livekit;
  useEffect(() => {
    if (!mainUser) return;

    const video = document.getElementById("main_video") as HTMLVideoElement;

    const audio = document.getElementById("main_audio") as HTMLAudioElement;

    if (video && mainUser.traks?.video) {
      mainUser.traks.video.track?.attach(video);
    }

    if (audio && mainUser.traks?.audio) {
      mainUser.traks.audio.track?.attach(audio);
    }
  }, [mainUser]);

  return (
    <div className="w-full h-full border-2 border-[#4a9582] rounded-lg relative">
      <div className="video h-full">
        <video id="main_video" className="w-full h-full object-cover" />
        <audio id="main_audio" className="hidden" />
      </div>
      <div className="operator w-full flex justify-between items-center absolute bottom-0 left-0 p-4">
        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full shadow-sm border border-emerald-200">
          <span className="text-emerald-900 text-sm font-medium">
            {mainUser?.name}
          </span>
        </div>
        <div className="voice">
          <Voice />
        </div>
      </div>
    </div>
  );
};
