import React from "react";
interface Props {
  children: React.ReactNode;
}
export const UserName: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-[#e9f5f3] px-3 py-1 rounded-lg">
      <span className="text-[#20947f] text-sm font-medium">{children}</span>
    </div>
  );
};
