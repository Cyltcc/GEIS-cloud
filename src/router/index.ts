import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import { getAccessToken, removeToken } from "@/utils/auth";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/dashboard",
		},
		{
			path: "/",
			component: Layout,
			children: [
				{
					path: "dashboard",
					name: "Dashboard",
					component: () => import("@/views/Dashboard.vue"),
					meta: { title: "首页" },
				},
				{
					path: "data-viz",
					name: "DataViz",
					component: () => import("@/views/Dashboard.vue"), // Placeholder
					meta: { title: "数据可视化" },
				},
				{
					path: "device",
					name: "Device",
					meta: { title: "设备管理" },
					children: [
						{
							path: "group",
							name: "DeviceGroup",
							component: () => import("@/views/device/DeviceGroup.vue"),
							meta: { title: "设备分组" },
						},
						{
							path: "list",
							name: "DeviceList",
							component: () => import("@/views/device/list/index.vue"),
							meta: { title: "设备列表" },
							redirect: "/device/list/standard",
							children: [

								{
									path: "standard",
									name: "standard",
									component: () => import("@/views/device/list/DeviceList.vue"),
									meta: { title: "定位观测站" },
								},
								{
									path: "video",
									name: "video",
									component: () => import("@/views/device/list/VideoList.vue"),
									meta: { title: "视频监测站" },
								},
								{
									path: "LORA",
									name: "LORA",
									component: () => import("@/views/device/list/LARO.vue"),
									meta: { title: "LORA组网站" },
								},
								{
									path: "Tiantong",
									name: "Tiantong",
									component: () => import("@/views/device/list/Tiantong.vue"),
									meta: { title: "天通" },
								},
							]
						},
						{
							path: "favorites",
							name: "DeviceFavorites",
							component: () => import("@/views/device/DeviceFavorites.vue"),
							meta: { title: "设备收藏" },
						},
						{
							path: "detail/:id",
							name: "DeviceDetail",
							component: () => import("@/views/device/detail/index.vue"),
							meta: { title: "设备详情" },
						},
					],
				},
				{
					path: "data-mgmt",
					name: "DataMgmt",
					meta: { title: "数据管理" },
					children: [
						{
							path: "download",
							name: "DataDownload",
							component: () => import("@/views/data/download/index.vue"),
							meta: { title: "数据下载" },
						},
						{
							path: "compute",
							name: "DataCompute",
							component: () => import("@/views/data/DataCompute.vue"),
							meta: { title: "数据计算" },
						},
						{
							path: "threshold",
							name: "ThresholdAlert",
							component: () => import("@/views/data/ThresholdAlert.vue"),
							meta: { title: "阈值告警" },
						},
						{
							path: "abnormal",
							name: "AbnormalData",
							component: () => import("@/views/data/AbnormalDat.vue"),
							meta: { title: "阈值告警" },
						},
					]
				},
				{
					path: "admin",
					name: "Admin",
					meta: { title: "后台管理" },
					redirect: "/admin/device",
					children: [
						{
							path: "device",
							name: "AdminDevice",
							component: () => import("@/views/admin/DeviceMgmt.vue"),
							meta: { title: "设备管理" },
						},
						{
							path: "sensor",
							name: "AdminSensor",
							component: () => import("@/views/admin/sensorMgmt/index.vue"),
							meta: { title: "传感器管理" },
							children: [
								{
									path: "data-add",
									name: 'SensorDataAdd',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorDataAdd.vue"),
									meta: { title: "添加传感器（数据类）" },
								},
								{
									path: "data-detail/:id",
									name: 'SensorDataDetail',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorDataDetail.vue"),
									meta: { title: "传感器数据详情" },
								},
								{
									path: "image-detail/:id",
									name: 'SensorImageDetail',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorImageDetail.vue"),
									meta: { title: "传感器图片详情" },
								}
							]
						},
						{
							path: "ota",
							name: "AdminOta",
							component: () => import("@/views/admin/OTAMgmt.vue"),
							meta: { title: "OTA" },
						},
						{
							path: "user",
							name: "AdminUser",
							component: () => import("@/views/admin/UserMgmt.vue"),
							meta: { title: "用户管理" },
						},
					],
				},
			],
		},
		{
			path: "/login",
			name: "Login",
			component: () => import("@/views/login/index.vue"),
			meta: { title: "登录" },
		}
	],
});

const WHITE_LIST = new Set(["/login"]);

router.beforeEach((to) => {
	const token = getAccessToken();

	if (WHITE_LIST.has(to.path)) {
		if (token && to.path === "/login") {
			return { path: "/dashboard", replace: true };
		}
		return true;
	}

	if (!token) {
		removeToken();
		return { path: "/login", replace: true };
	}

	return true;
});

export default router;
