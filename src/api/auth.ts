import service from '@/utils/request';

interface LoginData {
	username: string
	password: string
	grant_type: string
	client_id: string
	client_secret: string
}

export const login = (data: LoginData) => {
	const client = {
		client_id: "1",
		client_secret: "MpuK1xYUTPq7dDEyJydY1i1TojS4aW1c1iPGDZJg",
		grant_type: "password"
	};
	return service.post('/user/login', { ...data, ...client });
};

export const getImageCaptcha = (phone: string) => {
	return service.post('/captchas', { type: 'phone', phone });
};

export const getUserInfo = () => {
	return service.get('/user/info');
};

export const refreshToken = (data: object) => {
	return service.put('/authorizations/current', data);
}