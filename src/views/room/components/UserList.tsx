import React, { useContext } from "react";
import { Avatar } from "./Avatar";
import { Voice } from "./Voice";
import { LivekitContext } from "./LivekitContext";

export const UserList: React.FC = () => {
  const { livekit } = useContext(LivekitContext);
  const { userList } = livekit;
  return (
    <div className="h-full flex flex-col">
      <div className="title">
        <h3 className="text-xl font-bold">Participant</h3>
      </div>
      <div className="list flex-1 mt-4 space-y-4 overflow-auto">
        {userList.map((item, index) => (
          <div
            className="item flex justify-between items-center px-4 py-2"
            key={index}
          >
            <div className="left flex items-center gap-2">
              <Avatar>{item.name?.slice(0, 1)}</Avatar>
              <p className="name">{item.name}</p>
            </div>
            <div className="right flex items-center gap-2">
              <Voice isMuted={item.isMuted} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
