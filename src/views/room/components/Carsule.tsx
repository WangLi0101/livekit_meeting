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
export const VideoList: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const { userList, setMainUser } = livekit;
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {userList.map((item) => (
            <CarouselItem
              key={item.name}
              className="basis-1/3 h-[200px] cursor-pointer"
              onClick={() => setMainUser(item)}
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
