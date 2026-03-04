import service from '@/utils/request';

interface DevicesQuery {
	limit?: number;
	page?: number;
	keyword?: string;
}


/**
 * 获取定位观测站列表
 * @param query 查询参数，包括分页信息和搜索关键词
 * @returns 设备列表数据
 */
export const getDevicesList = (query: DevicesQuery) => {
	return service.get('/devices', { params: query });
}

/**
 * 获取LORA组网站列表
 * @param query 
 * @returns LORA组网站
 */
export const getLoraDeviceSList = (query?: object) => {
	return service.get('/distributed/gates', { params: query });
}

/**
 * 获取LORA子节点
 * @param gateway_id 网关ID
 * @return LORA子节点列表
 */
export const getLoralist = (gateway_id: string) => {
	return service.get(`/distributed/${gateway_id}/nodes`);
}

/**
 * 获取站点信息
 * @param id 设备ID
 * @returns 站点信息
 */
export const getDeviceInfo = (id: string) => {
	return service.get(`/devices/${id}`);
}

/**
 * 更新站点信息
 * @param id 设备ID
 * @param data 更新数据
 * @returns 更新结果
export const updateDeviceInfo = (id: string, data: object) => {
	return service.put(`/devices/${id}`, data);
}

/**
 * 绑定站点
 * @param query 绑定参数，包括ICCID、绑定类型和用户ID
 * @returns 绑定结果
 */
export const attachDevice = (query: {
	iccid: string;
	attach_type: string;
	user_id: string;
}) => {
	return service.post('/devices/attach', { data: query });
}

/**
 * 解绑站点
 * @param id 设备ID
 * @returns 更新结果
 */
export const detachDevice = (id: string) => {
	return service.post(`/device/${id}/detach`)
}