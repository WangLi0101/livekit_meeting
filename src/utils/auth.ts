/** 获取`token` */
export function getToken(): string | null {
  return localStorage.getItem("token");
}
// 设置token
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

/** 删除`token`*/
export function removeToken() {
  localStorage.removeItem("token");
  localStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
