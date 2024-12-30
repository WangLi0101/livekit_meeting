import React from "react";
import { Avatar } from "./Avatar";
import { Voice } from "./Voice";

export const UserList: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="title">
        <h3 className="text-xl font-bold">Participant</h3>
      </div>
      <div className="list flex-1 mt-4 space-y-4 overflow-auto">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className="item flex justify-between items-center px-4 py-2"
            key={index}
          >
            <div className="left flex items-center gap-2">
              <Avatar />
              <p className="name">Alexia</p>
            </div>
            <div className="right flex items-center gap-2">
              <Voice className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
