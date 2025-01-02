import type { service } from "./../../api/config";
import { config } from "@/api/config";
import { handleCode } from "./code";
import { formatToken, getToken } from "../auth";
import { toast } from "sonner";
export type ResponseData<T> = {
  code: number;
  data: T;
  message?: string;
};

type Base = keyof service;

export interface RequestOptions extends Partial<RequestInit> {
  formData?: FormData;
  isBlob?: boolean;
}

export function getOptions(options?: RequestOptions): RequestInit {
  const token = getToken();
  const headers: Record<string, string> = {
    authorization: token ? formatToken(token) : "",
  };
  if (options?.formData) {
    options.body = options.formData;
  } else {
    headers["Content-Type"] = "application/json";
  }
  // 设置默认值
  const defaultOptions: RequestInit = {
    method: "GET",
    headers,
  };
  return { ...defaultOptions, ...options };
}

export default async <T>(
  url: string,
  baseUrl: Base = "MOCK",
  option?: RequestOptions
): Promise<ResponseData<T>> => {
  const newOption = getOptions(option);
  const newUrl = config[baseUrl] + url;
  try {
    const response = await fetch(newUrl, newOption);
    let res;
    if (option && option.isBlob) {
      res = await response.blob();
    } else {
      res = await response.json();
    }
    if (res.code !== 0 && !option?.isBlob) {
      handleCode(res);
    }
    return res;
  } catch (error) {
    toast.error("服务繁忙");
    return Promise.reject(error);
  }
};
