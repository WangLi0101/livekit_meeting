import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Icon } from "@iconify/react";
// import clsx from "clsx";
import React, { useContext } from "react";
import { LivekitContext } from "./LivekitContext";

export const Control: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  return (
    <div className="px-4 flex items-cente gap-4">
      <div className="video">
        <Select
          value={livekit.currentCamera}
          onValueChange={(value) => {
            livekit.setCurrentCamera(value);
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
      <div className="audio">
        <Select
          value={livekit.currentMic}
          onValueChange={(value) => {
            livekit.setCurrentMic(value);
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
      {/* <div className="screen">
        <div
          className={clsx(
            "rounded-full bg-emerald-50 flex items-center justify-center p-3",
            {
              "bg-[rgba(241,154,146,.3)]": isScreen,
            }
          )}
        >
          <Icon
            icon={
              isScreen
                ? "material-symbols:stop-screen-share-outline-rounded"
                : "material-symbols:screen-share-outline"
            }
            fontSize={24}
          />
        </div>
      </div> */}
    </div>
  );
};
