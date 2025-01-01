import React, { useContext, useState, useRef } from "react";
import { Avatar } from "./Avatar";
import { LivekitContext } from "./LivekitContext";

export const Message: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const { livekit } = useContext(LivekitContext);
  const { sendMessag, messages } = livekit;
  const listRef = useRef<HTMLDivElement>(null);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessag(newMessage);
    setNewMessage("");
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="title p-4 border-b">
        <h3 className="text-xl font-semibold">Message</h3>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 " ref={listRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-2 max-w-[80%] items-center ${
                message.isSelf ? "flex-row-reverse" : ""
              }`}
            >
              <div className="left">
                <Avatar className="w-[45px] h-[45px]">
                  {message.sender.slice(0, 1)}
                </Avatar>
              </div>
              <div className="right">
                {!message.isSelf && (
                  <div className="text-sm  mb-1 font-bold px-3">
                    {message.sender}
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl ${
                    message.isSelf
                      ? "bg-[#219781] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 发送消息输入框 */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a Message"
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full 
                     focus:outline-none focus:ring-1 focus:ring-gray-300
                     placeholder-gray-500 text-gray-900"
          />
          <button
            type="submit"
            className="p-2 text-[#24272e] hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
