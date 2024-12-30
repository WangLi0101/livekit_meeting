import fetch from "@/utils/http";

// 获取签名
export function getSign(data: { username: string; roomName: string }) {
  return fetch<string>("/livekit/sign", "MANGMENT", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
