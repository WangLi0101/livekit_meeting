import React, { useState } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
interface Props {
  className?: string;
}
export const Voice: React.FC<Props> = ({ className }) => {
  const [isMuted, setIsMuted] = useState(false);
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center",
        {
          "bg-[rgba(241,154,146,.3)]": isMuted,
        },
        className
      )}
    >
      <Icon
        icon={isMuted ? "system-uicons:microphone-muted" : "mdi:microphone"}
        fontSize={24}
      />
    </div>
  );
};
