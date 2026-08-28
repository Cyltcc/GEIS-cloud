import service from '@/utils/request';
import type { RequestConfig } from '@/utils/request';
import { appConfig } from '@/config/env';
import { mockLogin, mockLogout, mockRefreshToken } from '@/mocks/auth';
import type { LoginData } from '@/types/auth';
export { normalizeAuthToken } from '@/utils/authToken';

export const login = (data: LoginData) => {
	if (appConfig.useMock) {
		return mockLogin(data);
	}

	return service.post('/auth/login', data, {
		skipAuth: true,
		skipTokenRefresh: true,
	});
};

// export const getImageCaptcha = (phone: string) => {
// 	return service.post('/captchas', { type: 'phone', phone });
// };

// export const getUserInfo = () => {
// 	return service.get('/user/info');
// };

export const refreshToken = (data: object, config?: RequestConfig) => {
	if (appConfig.useMock) {
		return mockRefreshToken(data as Record<string, unknown>);
	}

	return service.put('/auth/refresh', data, {
		...config,
		skipAuth: true,
		skipTokenRefresh: true,
	});
}

export const logout = () => {
	if (appConfig.useMock) {
		return mockLogout();
	}

	return service.post('/auth/logout', undefined, {
		skipTokenRefresh: true,
	});
}
