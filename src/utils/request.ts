import axios, {
	type AxiosInstance,
	AxiosHeaders,
	type AxiosError,
	type InternalAxiosRequestConfig,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { message } from "ant-design-vue";
import { appConfig } from "@/config/env";
import { mockRefreshToken } from "@/mocks/auth";
import type { ApiResponse } from "@/types/api";
import { normalizeAuthToken } from "@/utils/authToken";
import {
	getRefreshToken,
	getToken,
	isAccessTokenExpired,
	removeToken,
	setToken,
	type DataInfo,
} from "@/utils/auth";

export type { ApiResponse } from "@/types/api";

export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
	skipAuth?: boolean;
	skipTokenRefresh?: boolean;
	skipErrorMessage?: boolean;
	_retry?: boolean;
}

type InternalRequestConfig<D = unknown> = InternalAxiosRequestConfig<D> &
	Pick<RequestConfig<D>, "skipAuth" | "skipTokenRefresh" | "skipErrorMessage" | "_retry">;

type RequestInstance = Omit<
	AxiosInstance,
	"get" | "post" | "put" | "delete" | "request"
> & {
	<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>>;
	get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
	post<T = unknown, D = unknown>(
		url: string,
		data?: D,
		config?: RequestConfig<D>
	): Promise<ApiResponse<T>>;
	put<T = unknown, D = unknown>(
		url: string,
		data?: D,
		config?: RequestConfig<D>
	): Promise<ApiResponse<T>>;
	delete<T = unknown>(
		url: string,
		config?: RequestConfig
	): Promise<ApiResponse<T>>;
};

const service = axios.create({
	baseURL: appConfig.apiBaseUrl,
	timeout: 15000,
});

const request = service as RequestInstance;

let refreshPromise: Promise<string> | null = null;
let isLoggingOut = false;

const isUnauthorized = (response?: AxiosResponse<ApiResponse>) => {
	return (
		response?.status === 401 ||
		response?.data?.code === 401 ||
		response?.data?.code === "401"
	);
};

const isSuccess = (code: unknown) => {
	return (
		code === undefined ||
		code === 0 ||
		code === 200 ||
		code === "0" ||
		code === "200"
	);
};

const getErrorMessage = (data: unknown, fallback = "Request failed") => {
	if (!data || typeof data !== "object") {
		return fallback;
	}

	const payload = data as Record<string, unknown>;
	return String(payload.message || payload.msg || fallback);
};

const getAppPath = (path: string) => {
	const base = import.meta.env.BASE_URL || "/";
	const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizedBase}${normalizedPath}` || normalizedPath;
};

const goLogin = (showMessage = true) => {
	if (isLoggingOut) return;  // 已在进行注销，直接返回
	isLoggingOut = true;

	removeToken();
	const loginPath = getAppPath("/login");
	if (location.pathname !== loginPath) {
		if (showMessage) {
			message.error("登录已过期，请重新登录");
		}
		location.href = loginPath;
	}
};

export const refreshAccessToken = async () => {
	if (!refreshPromise) {
		refreshPromise = (async () => {
			const currentRefreshToken = getRefreshToken();

			if (!currentRefreshToken) {
				throw new Error("Refresh token not found");
			}

			const refreshPayload = {
				refreshToken: currentRefreshToken,
				refresh_token: currentRefreshToken,
			};
			const responseData = appConfig.useMock
				? await mockRefreshToken(refreshPayload)
				: await request.put<ApiResponse>(
						"/auth/refresh",
						refreshPayload,
						{
							skipAuth: true,
							skipTokenRefresh: true,
							skipErrorMessage: true,
						}
					);

			const nextToken = normalizeAuthToken(responseData);

			if (!nextToken.accessToken) {
				throw new Error("Refresh response missing token");
			}

			setToken({
				accessToken: nextToken.accessToken,
				refreshToken: nextToken.refreshToken || currentRefreshToken,
				expires: nextToken.expires,
			} as DataInfo<number>);

			// 刷新成功，重置注销标志（可选，避免后续再次刷新失败时被锁住）
			isLoggingOut = false;

			return nextToken.accessToken;
		})().catch((error) => {

			message.error("登录已失效，请重新登录");
			goLogin(false);
			// 重新抛出错误，让等待的请求也能感知到失败
			throw error;
		}).finally(() => {
			refreshPromise = null;
		});
	}

	return refreshPromise;
};

const retryRequest = (config: RequestConfig, token: string) => {
	const headers = AxiosHeaders.from(
		config.headers as AxiosHeaders | undefined
	);
	headers.set("Authorization", `Bearer ${token}`);

	config.headers = headers;
	config._retry = true;

	return service(config);
};

const ensureAccessToken = async (config: InternalRequestConfig) => {
	if (config.skipAuth) {
		return "";
	}

	const currentToken = getToken();
	if (!currentToken?.accessToken) {
		return "";
	}

	if (config.skipTokenRefresh || !isAccessTokenExpired(currentToken)) {
		return currentToken.accessToken;
	}

	return refreshAccessToken();
};

service.interceptors.request.use(async (config) => {
	const requestConfig = config as InternalRequestConfig;
	let token = "";

	try {
		token = await ensureAccessToken(requestConfig);
	} catch (error) {
		goLogin();
		return Promise.reject(error);
	}

	if (token && !requestConfig.skipAuth) {
		const headers = AxiosHeaders.from(requestConfig.headers);
		headers.set("Authorization", `Bearer ${token}`);
		requestConfig.headers = headers;
	}

	return requestConfig;
});

const handleResponse = async (response: AxiosResponse<ApiResponse>) => {
	const typedResponse = response as AxiosResponse<ApiResponse>;
	const config = typedResponse.config as RequestConfig;
	const { data } = typedResponse;

	if (!isSuccess(data?.code)) {
		const errorText = getErrorMessage(data);

		if (
			isUnauthorized(typedResponse) &&
			!config._retry &&
			!config.skipTokenRefresh
		) {
			try {
				const token = await refreshAccessToken();
				return retryRequest(config, token);
			} catch (refreshError) {
				goLogin();
				return Promise.reject(refreshError);
			}
		}

		if (isUnauthorized(typedResponse) && !config.skipTokenRefresh) {
			goLogin();
		}

		if (!config.skipErrorMessage) {
			message.error(errorText);
		}
		return Promise.reject(new Error(errorText));
	}

	return data;
};

service.interceptors.response.use(
	handleResponse as never,
	async (error: AxiosError<ApiResponse>) => {
		const config = (error.config || {}) as RequestConfig;

		if (
			isUnauthorized(error.response) &&
			!config._retry &&
			!config.skipTokenRefresh
		) {
			try {
				const token = await refreshAccessToken();
				return retryRequest(config, token);
			} catch (refreshError) {
				goLogin();
				return Promise.reject(refreshError);
			}
		}

		const errorText = getErrorMessage(error.response?.data, error.message);
		if (!config.skipErrorMessage) {
			message.error(errorText);
		}

		if (isUnauthorized(error.response) && !config.skipTokenRefresh) {
			goLogin();
		}

		return Promise.reject(error);
	}
);

export default request;
