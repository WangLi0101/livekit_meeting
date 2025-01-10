export type service = {
  MOCK: string;
  MANGMENT: string;
};
// dev环境
const dev_url = "http://localhost:3000";
// const dev_url = "http://47.120.58.223:3000";
const oss_url = "https://betterme-blog.oss-cn-beijing.aliyuncs.com";
const dev_service: service = {
  MOCK: ``,
  MANGMENT: `${dev_url}/api/v1`,
};

// 生产环境
const prod_url = "http://47.120.58.223:3000";
const prod_server: service = {
  MOCK: `/mock`,
  MANGMENT: `${prod_url}/api/v1`,
};

let config: service;
let livekit_url = "ws://localhost:7880";

switch (import.meta.env.MODE) {
  case "development":
    config = dev_service;
    livekit_url = "wss://wangli-bkzhjkbc.livekit.cloud";
    break;
  case "production":
    config = prod_server;
    livekit_url = "wss://wangli-bkzhjkbc.livekit.cloud";
    break;
  default:
    break;
}
export { config, oss_url, livekit_url };
