import service from '@/utils/request';

interface DevicesQuery {
	limit?: number;
	per_page?: number;
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

/**
 * 请求站点数据
 * @param device_id 设备ID
 * @param query 查询参数，时间范围
 * @returns 站点数据列表
 */
export const getDeviceDatas = (device_id: string, query: any) => {
	return service.get(`/devices/${device_id}/datas`, { params: query });
}

/**
 * 获取最新站点数据
 * @param device_id 设备ID
 * @param data_type 数据类型
 * @returns 最新站点数据
 */
export const getDeviceLatestData = (device_id: string, data_type: string) => {
	return service.get(`devices/${device_id}/datas/new/${data_type}`);
}

/**
 * 网关——节点关联绑定操作
 * @param gateway 网关ID
 * @param node 节点ID
 * @returns 绑定结果
 */
export const attachChildren = (gateway: string, node: string) => {
	return service.post(`/device/gateway/${gateway}/node/${node}`);
}

/**
 * 获取指定设备的元数据
 * @param device_id 设备ID
 * @returns 设备元数据
 */
export const getDeviceMeta = (device_id: string) => {
	return service.get(`/device/${device_id}/meta_info`);
}

/**
 * 更新指定设备元数据
 * @param device_id 设备ID
 * @param query 更新数据
 * @returns 更新结果
 */
export const updateDeviceMeta = (device_id: string, query: object) => {
	return service.put(`/device/${device_id}/meta_info`, { data: query });
}

/**
 * 判断LoraWAN网关是否在线
 * @param device_id 网关ID
 * @return 在线状态
 */
export const loraIsOnline = (device_id: number) => {
	return service.get(`/mqtt/device/${device_id}/is_online`);
}

/**
 * 根据关键字和分页对设备进行搜索
 * @param query 搜索参数，包括关键字和分页信息
 * @returns 搜索结果列表
 */
export const searchDevices = (query: DevicesQuery) => {
	return service.get('/devices/search', { params: query });
}

