import React, { useEffect } from "react";
import { Voice } from "./Voice";
import { User } from "@/hooks/useLiveKit";
import { Avatar } from "./Avatar";
import { UserName } from "./UserName";
import { RemoteTrackPublication, VideoQuality } from "livekit-client";
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

    if (video && item.traks?.camera) {
      if (!item.isMy) {
        (item.traks.camera as RemoteTrackPublication).setVideoQuality(
          VideoQuality.LOW
        );
      }
      item.traks.camera.track?.attach(video);
    }

    if (audio && item.traks?.microphone) {
      item.traks.microphone.track?.attach(audio);
    }
  }, [item]);
  return (
    <div className="w-full h-full border-2 border-[#4a9582] rounded-lg relative">
      {item.traks.camera ? (
        <div className="video h-full">
          <video id={`${item.name}_video`} className="w-full h-full" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Avatar className="w-[60px] h-[60px]">
            {item.name?.slice(0, 1)}
          </Avatar>
        </div>
      )}
      <audio id={`${item.name}_audio`} className="hidden" />
      <div className="operator w-full flex justify-between items-center absolute bottom-0 left-0 p-4">
        <UserName>{item?.name}</UserName>
        <div className="voice">
          {!item.isMy && (
            <Voice isMuted={item.isMuted} disabled={!item.traks.microphone} />
          )}
        </div>
      </div>
    </div>
  );
};
