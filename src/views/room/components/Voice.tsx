import React from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
interface Props {
  className?: string;
  isMuted?: boolean;
  disabled?: boolean;
}
export const Voice: React.FC<Props> = ({ className, isMuted, disabled }) => {
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center cursor-pointer",
        {
          "!bg-[rgba(241,154,146,1)]": isMuted,
          "!bg-gray-500": disabled,
          "!cursor-not-allowed": disabled,
        },
        className
      )}
    >
      <Icon
        icon={isMuted ? "streamline:voice-mail-off-solid" : "mdi:microphone"}
        fontSize={isMuted ? 16 : 24}
        className={clsx({
          "text-white": isMuted,
        })}
      />
    </div>
  );
};
