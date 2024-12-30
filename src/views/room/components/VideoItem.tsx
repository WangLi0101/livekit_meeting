import React, { useEffect } from "react";
import { Voice } from "./Voice";
import { User } from "@/hooks/useLiveKit";
interface Props {
  item: User;
}
export const VideoItem: React.FC<Props> = ({ item }) => {
  useEffect(() => {
    if (!item.name) return;
    const video = document.getElementById(
      `${item.name}_video`
    ) as HTMLVideoElement;

    const audio = document.getElementById(
      `${item.name}_audio`
    ) as HTMLAudioElement;

    if (video && item.traks?.video) {
      item.traks.video.track?.attach(video);
    }

    if (audio && item.traks?.audio) {
      item.traks.audio.track?.attach(audio);
    }
  }, [item]);
  return (
    <div className="w-full h-full border-2 border-[#4a9582] rounded-lg relative">
      <div className="video h-full">
        <video id={`${item.name}_video`} className="w-full h-full" />
        <audio id={`${item.name}_audio`} className="hidden" />
      </div>
      <div className="operator w-full flex justify-between items-center absolute bottom-0 left-0 p-4">
        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full shadow-sm border border-emerald-200">
          <span className="text-emerald-900 text-sm font-medium">
            {item?.name}
          </span>
        </div>
        <div className="voice">
          <Voice />
        </div>
      </div>
    </div>
  );
};
