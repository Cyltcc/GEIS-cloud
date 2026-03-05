import service from '@/utils/request';

/**
 * 获取视频站点列表
 * @returns 视频站点列表
 */
export const getCameras = () => {
	return service.get('/cameras');
}

/**
 * 绑定视频站点
 * @param data 视频绑定参数
 */
export const attachCameras = (data: any) => {
	return service.post('/cameras/attach', { data: data });
}

/**
 * 解绑视频站点
 * @param data 视频解绑参数
 */
export const detachCameras = (data: any) => {
	return service.post(`/cameras/${data.camerasid}/detach`, { data: data });
}

/**
 * 更新视频站点信息
 * @param data 视频站点信息
 */
export const putCameras = (data: any) => {
	return service.post(`/cameras/${data.camerasid}/update`, { data: data });
}
