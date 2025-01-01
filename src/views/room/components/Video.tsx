import React from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
interface Props {
  className?: string;
  isClose?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const Video: React.FC<Props> = ({
  className,
  isClose,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        "w-[40px] h-[40px] p-3 rounded-full flex items-center justify-center cursor-pointer",
        {
          "!bg-[#fbeced]": isClose,
          "!bg-[#eaf4f2]": !isClose,
          "!cursor-not-allowed": disabled,
        },
        className
      )}
      onClick={onClick}
    >
      <Icon
        icon={
          isClose
            ? "material-symbols:video-camera-front-off-outline"
            : "material-symbols:videocam-outline"
        }
        fontSize={24}
        className={clsx({
          "text-[#ea453a]": isClose,
          "text-[#4a9582]": !isClose,
        })}
      />
    </div>
  );
};
