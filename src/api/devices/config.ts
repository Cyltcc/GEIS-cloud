import service from '@/utils/request';

/**
 * 获取所有固件
 * @return 固件列表
 */
export const getFirmwares = () => {
	return service.get('/firmwares');
}

/**
 * 查看固件详情
 * @param detail_id 固件ID
 * @return 固件详情
 */
export const getFirmwareDetail = (detail_id: string) => {
	return service.get(`/firmwares/${detail_id}`);
}

/**
 * 获取最新的config
 * @param device_id 设备ID
 * @return 最新config
 */
export const getLastConfig = (device_id: string) => {
	return service.get(`/devices/${device_id}/config`);
}

/**
 * 根据id 获取config
 * @param device_id 设备ID
 * @param config_id 配置ID
 * @return config详情
 */
export const getConfigById = (device_id: string, config_id: string) => {
	return service.get(`/devices/${device_id}/config/${config_id}`);
}

/**
 * 更新设备配置
 * @param device_id 设备ID
 * @param config 配置数据
 * @return 更新结果
 */
export const updateConfig = (device_id: string, config: any) => {
	return service.post(`/devices/${device_id}/config`, { data: config });
}

/**
 * 批量更新修改接口
 */
export const uploadConfigMulti = (devices: any, config: any) => {
	return service.post('/device/config/multi', { data: { devices, config } });
}

/**
 * 获取最新图像识别config
 * @param device_id 设备ID
 * @return 最新图像识别config
 */
export const getLastImageConfig = (device_id: string) => {
	return service.get(`/app/recognizations/devices/${device_id}/config`);
}

/**
 * 更新图像识别config
 * @param device_id 设备ID
 * @param config 图像识别配置数据
 * @return 更新结果
 */
export const updateImageConfig = (device_id: string, config: any) => {
	return service.post(`/app/recognizations/devices/${device_id}/config`, { data: config });
}

/**
 * 批量创建设备配置
 */
export const createConfigMulti = (data: any) => {
	return service.post('/devices/config/multi', { data });
}
