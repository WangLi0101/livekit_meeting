import React, { useContext } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VideoItem } from "./VideoItem";
import { LivekitContext } from "./LivekitContext";
import { User } from "@/hooks/useLiveKit";
import { RemoteTrackPublication, VideoQuality } from "livekit-client";
export const VideoList: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const { userList, setMainUser, mainUser } = livekit;
  const setCurrentUser = (item: User) => {
    if (!mainUser?.isMy && mainUser?.traks.camera) {
      (mainUser.traks.camera as RemoteTrackPublication).setVideoQuality(
        VideoQuality.LOW
      );
    }
    setMainUser(item);
  };
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {userList.map((item) => (
            <CarouselItem
              key={item.name}
              className="basis-1/3 h-[170px] cursor-pointer"
              onClick={() => setCurrentUser(item)}
            >
              <VideoItem item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
