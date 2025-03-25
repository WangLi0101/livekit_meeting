import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

declare global {
  interface Window {
    env: {
      REACT_APP_DEEPSEEK_API_KEY: string;
    };
  }
}

interface Message {
  role: "user" | "system";
  content: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const callDeepSeekAPI = async (userMessage: string) => {
    setLoading(true);
    try {
      // 这里替换为实际的 DeepSeek API 调用
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env?.VITE_DEEPSEEK_API_KEY || ""
            }`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            temperature: 1.3,
            messages: [
              {
                role: "user",
                content: "假如你是女朋友，说出下列每句话的本意，以及怎么回复",
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: "user", content: userMessage },
            ],
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流");
      }

      const decoder = new TextDecoder();
      let partialResponse = "";
      let completeResponse = "";

      setMessages((prev) => [...prev, { role: "system", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialResponse + chunk).split("\n");
        partialResponse = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0]?.delta?.content) {
                completeResponse += data.choices[0].delta.content;

                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "system",
                    content: completeResponse,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("解析流数据时出错:", e);
            }
          }
        }
      }

      return completeResponse;
    } catch (error) {
      console.error("调用 DeepSeek API 时出错:", error);
      return "很抱歉，发生了错误。请稍后再试。";
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      await callDeepSeekAPI(input);
    } catch (error) {
      console.error("处理消息时出错:", error);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "很抱歉，发生了错误。请稍后再试。" },
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white px-6 py-3 rounded-full shadow-md flex items-center">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mr-3 flex items-center justify-center">
            <svg
              className="h-3 w-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-11V3"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI
          </h1>
        </div>
      </div>

      <div
        ref={messageRef}
        className="flex-1 overflow-y-auto mb-4 md:mb-6 p-4 md:p-5 bg-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-80 border border-gray-100"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Welcome to the AI Assistant
            </h3>
            <p className="max-w-md text-gray-500 mb-8">
              Start asking questions and exploring AI The infinite
              possibilities. I can answer questions, provide information, or
              engage in interesting conversations.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "system" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mr-2 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.role === "user" ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                        components={{
                          a: ({ node: _node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            />
                          ),
                          code: ({
                            node: _node,
                            inline,
                            className,
                            children,
                            ...props
                          }) => {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <div className="relative my-3">
                                <div className="absolute top-0 right-0 bg-gray-100 rounded-bl rounded-tr px-2 py-1 text-xs text-gray-600 font-mono">
                                  {match[1]}
                                </div>
                                <pre className="rounded-lg bg-gray-100 p-3 pt-6 overflow-x-auto text-sm">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code
                                className="bg-gray-100 text-gray-800 rounded px-1 py-0.5 mx-0.5 font-mono text-sm"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          h1: ({ node: _node, ...props }) => (
                            <h1 className="text-xl font-bold my-3" {...props} />
                          ),
                          h2: ({ node: _node, ...props }) => (
                            <h2 className="text-lg font-bold my-3" {...props} />
                          ),
                          h3: ({ node: _node, ...props }) => (
                            <h3
                              className="text-base font-bold my-2"
                              {...props}
                            />
                          ),
                          ul: ({ node: _node, ...props }) => (
                            <ul className="list-disc pl-6 my-2" {...props} />
                          ),
                          ol: ({ node: _node, ...props }) => (
                            <ol className="list-decimal pl-6 my-2" {...props} />
                          ),
                          table: ({ node: _node, ...props }) => (
                            <div className="overflow-x-auto my-3">
                              <table
                                className="min-w-full border-collapse"
                                {...props}
                              />
                            </div>
                          ),
                          thead: ({ node: _node, ...props }) => (
                            <thead className="bg-gray-100" {...props} />
                          ),
                          th: ({ node: _node, ...props }) => (
                            <th
                              className="border border-gray-300 px-3 py-1 text-left font-semibold"
                              {...props}
                            />
                          ),
                          td: ({ node: _node, ...props }) => (
                            <td
                              className="border border-gray-300 px-3 py-1"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 ml-2 flex-shrink-0 flex items-center justify-center shadow-sm">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 p-3 border border-gray-100">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            className="w-full p-4 pr-20 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 flex items-center justify-center w-12 h-10"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
