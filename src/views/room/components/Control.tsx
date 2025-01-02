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
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
export const Control: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const navigate = useNavigate();
  const {
    mutedLocalHandler,
    setDevice,
    closeVideo,
    createCameraTrack,
    createScreenTrack,
    closeScreen,
    disconnect,
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
  const handleScreen = () => {
    if (my?.traks.screen_share) {
      closeScreen();
    } else {
      createScreenTrack();
    }
  };
  const leaveRoom = async () => {
    await disconnect();
    navigate("/");
  };
  return (
    <div className="px-4 flex items-center justify-between">
      <div className="left flex items-center gap-4">
        <div className="video flex items-center gap-2">
          <Video isClose={!my?.traks.camera} onClick={handleVideo} />
          <Select
            value={livekit.currentCamera}
            onValueChange={(value) => {
              setDevice(value, "videoinput");
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
              setDevice(value, "audioinput");
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
        <Screen isClose={!my?.traks.screen_share} onClick={handleScreen} />
      </div>
      <div className="right">
        <Button variant="destructive" size="sm" onClick={leaveRoom}>
          <Icon icon="material-symbols:logout" />
          Leave Meeting
        </Button>
      </div>
    </div>
  );
};
