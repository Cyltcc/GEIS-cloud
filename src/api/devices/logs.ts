import service from '@/utils/request';

/**
 * 获取设备日志列表
 * @param device_id 设备ID
 * @param query 查询参数
 * @returns 设备日志列表
 */
export const getDeviceLogs = (device_id: string, query: any) => {
	return service.get(`/logs/${device_id}`, { params: query });
}