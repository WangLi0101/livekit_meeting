import React from "react";
interface Props {
  children: React.ReactNode;
}
export const UserName: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-[#ecf4f2] px-3 py-1 rounded-lg">
      <span className="text-[#5d9383] text-sm font-medium">{children}</span>
    </div>
  );
};
