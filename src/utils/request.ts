import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { message } from "ant-design-vue";
import { getAccessToken, removeToken } from "@/utils/auth";

export interface ApiResponse<T = unknown> {
  code?: number | string;
  message?: string;
  msg?: string;
  data?: T;
  [key: string]: unknown;
}

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean;
  skipErrorMessage?: boolean;
  rawResponse?: boolean;
}

const SUCCESS_CODES = new Set<number | string>([0, 200, "0", "200"]);
const DEFAULT_TIMEOUT = 15000;

let lastErrorText = "";
let lastErrorTime = 0;

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: DEFAULT_TIMEOUT,
});

const isSuccessCode = (code: unknown): boolean => {
  if (code === undefined || code === null || code === "") {
    return true;
  }
  return SUCCESS_CODES.has(code as number | string);
};

const showError = (text: string) => {
  const now = Date.now();
  if (text === lastErrorText && now - lastErrorTime < 1200) {
    return;
  }
  lastErrorText = text;
  lastErrorTime = now;
  message.error(text);
};

const getBusinessMessage = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") {
    return "Request failed";
  }
  const data = payload as Record<string, unknown>;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (typeof data.msg === "string" && data.msg.trim()) {
    return data.msg;
  }
  return "Request failed";
};

const getHttpErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data;
  if (responseData && typeof responseData === "object") {
    const payload = responseData as Record<string, unknown>;
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
    if (typeof payload.msg === "string" && payload.msg.trim()) {
      return payload.msg;
    }
  }

  switch (error.response?.status) {
    case 400:
      return "Bad request";
    case 401:
      return "Login expired, please sign in again";
    case 403:
      return "No permission to access this resource";
    case 404:
      return "Request resource not found";
    case 408:
      return "Request timeout";
    case 500:
      return "Server internal error";
    case 502:
      return "Bad gateway";
    case 503:
      return "Service unavailable";
    case 504:
      return "Gateway timeout";
    default:
      return error.message || "Network error";
  }
};

service.interceptors.request.use(
  (config) => {
    const nextConfig = config as RequestConfig;
    const token = getAccessToken();

    if (token && !nextConfig.skipAuth) {
      const headers = AxiosHeaders.from(nextConfig.headers);
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      nextConfig.headers = headers;
    }

    return nextConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const requestConfig = response.config as RequestConfig;

    if (requestConfig.rawResponse) {
      return response;
    }

    const payload = response.data;
    if (!isSuccessCode(payload?.code)) {
      const errMessage = getBusinessMessage(payload);
      if (!requestConfig.skipErrorMessage) {
        showError(errMessage);
      }
      return Promise.reject(new Error(errMessage));
    }

    return payload;
  },
  (error: AxiosError) => {
    const requestConfig = (error.config || {}) as RequestConfig;

    if (error.response?.status === 401) {
      removeToken();
      if (location.pathname !== "/login") {
        location.href = "/login";
      }
    }

    const errMessage = getHttpErrorMessage(error);
    if (!requestConfig.skipErrorMessage) {
      showError(errMessage);
    }

    return Promise.reject(error);
  }
);

export default service;
