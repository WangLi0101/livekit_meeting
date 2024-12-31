import { cn } from "@/lib/utils";
import React from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
}
export const Avatar: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};
