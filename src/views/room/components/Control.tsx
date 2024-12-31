import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useContext } from "react";
import { LivekitContext } from "./LivekitContext";
import { Voice } from "./Voice";
import { Video } from "./Video";
import { Screen } from "./Screen";

export const Control: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const {
    mutedLocalHandler,
    setCamera,
    setMic,
    closeVideo,
    createCameraTrack,
    my,
    currentCamera,
  } = livekit;
  const handleMuted = () => {
    mutedLocalHandler(!my?.isMuted);
  };

  const handleVideo = () => {
    if (my?.traks.camera) {
      closeVideo();
    } else {
      createCameraTrack(currentCamera);
    }
  };
  return (
    <div className="px-4 flex items-cente gap-4 justify-center">
      <div className="video flex items-center gap-2">
        <Video isClose={!my?.traks.camera} onClick={handleVideo} />
        <Select
          value={livekit.currentCamera}
          onValueChange={(value) => {
            setCamera(value);
          }}
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="video" />
          </SelectTrigger>
          <SelectContent>
            {livekit.cameraList.map((item) => (
              <SelectItem key={item.deviceId} value={item.deviceId}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Voice isMuted={my?.isMuted} onClick={handleMuted} />
        <Select
          value={livekit.currentMic}
          onValueChange={(value) => {
            setMic(value);
          }}
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="audio" />
          </SelectTrigger>
          <SelectContent>
            {livekit.micList.map((item) => (
              <SelectItem key={item.deviceId} value={item.deviceId}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Screen />
    </div>
  );
};
