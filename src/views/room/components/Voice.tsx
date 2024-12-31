import React from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
interface Props {
  className?: string;
  isMuted?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const Voice: React.FC<Props> = ({
  className,
  isMuted,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer",
        {
          "!bg-[#fbeced]": isMuted,
          "!bg-[#eaf4f2]": !isMuted,
          "!cursor-not-allowed": disabled,
        },
        className
      )}
      onClick={onClick}
    >
      <Icon
        icon={isMuted ? "streamline:voice-mail-off-solid" : "mdi:microphone"}
        fontSize={isMuted ? 16 : 24}
        className={clsx({
          "text-[#ea453a]": isMuted,
          "text-[#4a9582]": !isMuted,
        })}
      />
    </div>
  );
};
