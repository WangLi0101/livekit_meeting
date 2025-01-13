import React from "react";
import Icp from "@/assets/images/icp.png";
export const Footer: React.FC = () => {
  return (
    <div className="text-center text-white text-sm  py-[10px] fixed bottom-0 left-0 w-full">
      <p>
        <a
          href="http://beian.miit.gov.cn/"
          target="_blank"
          className="flex items-center justify-center"
        >
          <img src={Icp} alt="icp" className="w-4 h-4 mr-2" />
          冀ICP备2025099328号-1
        </a>
      </p>
    </div>
  );
};
