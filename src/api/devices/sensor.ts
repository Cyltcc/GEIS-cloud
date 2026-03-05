import service from '@/utils/request';

/**
 * 获取传感器列表
 * @returns 传感器列表
 */
export const getSensors = () => {
	return service.get('/sensors');
}

/**
 * 获取传感器详细信息
 * @param sensor_id 传感器ID
 * @returns 传感器详细信息
 */
export const getSensorDetail = (sensor_id: string) => {
	return service.get(`/sensor/${sensor_id}`);
}

/**
 * 创建传感器
 * @param query 传感器数据
 * @return 创建结果
 */
export const createSensor = (query: object) => {
	return service.post('/sensor', { data: query });
}

/**
 * 删除传感器信息
 * @param sensor_id 传感器ID
 * @return 删除结果
 */
export const deleteSensor = (sensor_id: string) => {
	return service.delete(`/sensor/${sensor_id}`);
}

/**
 * 修改传感器信息
 * @param sensor_id 传感器ID
 * @param query 传感器数据
 * @return 修改结果
 */
export const updateSensor = (sensor_id: string, query: object) => {
	return service.post(`/sensor/${sensor_id}/update`, { data: query });
}