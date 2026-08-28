import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import { getToken, isAccessTokenExpired, removeToken } from "@/utils/auth";
import { refreshAccessToken } from "@/utils/request";

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
			meta: { requiresAuth: true },
			children: [
				{
					path: "dashboard",
					name: "Dashboard",
					component: () => import("@/views/Dashboard.vue"),
					meta: { titleKey: "route.dashboard" },
				},
				{
					path: "data-viz",
					name: "DataViz",
					component: () => import("@/views/Dashboard.vue"), // Placeholder
					meta: { titleKey: "route.dataViz" },
				},
				{
					path: "device",
					name: "Device",
					meta: { titleKey: "route.deviceMgmt", featureCode: "device.management" },
					children: [
						{
							path: "group",
							name: "DeviceGroup",
							component: () => import("@/views/device/DeviceGroup.vue"),
							meta: { titleKey: "route.deviceGroup" },
						},
						{
							path: "list",
							name: "DeviceList",
							component: () => import("@/views/device/list/index.vue"),
							meta: { titleKey: "route.deviceList" },
							redirect: "/device/list/standard",
							children: [

								{
									path: "standard",
									name: "standard",
									component: () => import("@/views/device/list/DeviceList.vue"),
									meta: { titleKey: "route.standardStation" },
								},
								{
									path: "video",
									name: "video",
									component: () => import("@/views/device/list/VideoList.vue"),
									meta: { titleKey: "route.videoStation" },
								},
								{
									path: "LORA",
									name: "LORA",
									component: () => import("@/views/device/list/LARO.vue"),
									meta: { titleKey: "route.loraStation" },
								},
								{
									path: "Tiantong",
									name: "Tiantong",
									component: () => import("@/views/device/list/Tiantong.vue"),
									meta: { titleKey: "route.tiantong" },
								},
							]
						},
						{
							path: "favorites",
							name: "DeviceFavorites",
							component: () => import("@/views/device/DeviceFavorites.vue"),
							meta: { titleKey: "route.deviceFavorites" },
						},
						{
							path: "detail/:id",
							name: "DeviceDetail",
							component: () => import("@/views/device/detail/index.vue"),
							meta: { titleKey: "route.deviceDetail" },
						},
					],
				},
				{
					path: "data-mgmt",
					name: "DataMgmt",
					meta: { titleKey: "route.dataMgmt", featureCode: "data.management" },
					children: [
						{
							path: "download",
							name: "DataDownload",
							component: () => import("@/views/data/download/index.vue"),
							meta: { titleKey: "route.dataDownload" },
						},
						{
							path: "compute",
							name: "DataCompute",
							component: () => import("@/views/data/DataCompute.vue"),
							meta: { titleKey: "route.dataCompute" },
						},
						{
							path: "threshold",
							name: "ThresholdAlert",
							component: () => import("@/views/data/ThresholdAlert.vue"),
							meta: { titleKey: "route.thresholdAlert" },
						},
						{
							path: "abnormal",
							name: "AbnormalData",
							component: () => import("@/views/data/AbnormalDat.vue"),
							meta: { titleKey: "route.abnormalData" },
						},
					]
				},
				{
					path: "admin",
					name: "Admin",
					meta: { titleKey: "route.admin", featureCode: "admin.console" },
					redirect: "/admin/device",
					children: [
						{
							path: "device",
							name: "AdminDevice",
							component: () => import("@/views/admin/DeviceMgmt.vue"),
							meta: { titleKey: "route.adminDevice", featureCode: "device.management" },
						},
						{
							path: "sensor",
							name: "AdminSensor",
							component: () => import("@/views/admin/sensorMgmt/index.vue"),
							meta: { titleKey: "route.adminSensor", featureCode: "sensor.management" },
							children: [
								{
									path: "data-add",
									name: 'SensorDataAdd',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorDataAdd.vue"),
									meta: { titleKey: "route.sensorDataAdd" },
								},
								{
									path: "image-add",
									name: 'SensorImageAdd',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorImageAdd.vue"),
									meta: { titleKey: "route.sensorImageAdd" },
								},
								{
									path: "data-detail/:id",
									name: 'SensorDataDetail',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorDataDetail.vue"),
									meta: { titleKey: "route.sensorDataDetail" },
								},
								{
									path: "image-detail/:id",
									name: 'SensorImageDetail',
									component: () => import("@/views/admin/sensorMgmt/detail/SensorImageDetail.vue"),
									meta: { titleKey: "route.sensorImageDetail" },
								}
							]
						},
						{
							path: "ota",
							name: "AdminOta",
							component: () => import("@/views/admin/OTAMgmt.vue"),
							meta: { titleKey: "route.adminOta" },
						},
						{
							path: "user",
							name: "AdminUser",
							component: () => import("@/views/admin/UserMgmt.vue"),
							meta: { titleKey: "route.adminUser", featureCode: "user.management" },
						},
						{
							path: "tenant",
							name: "AdminTenant",
							component: () => import("@/views/admin/TenantMgmt.vue"),
							meta: { titleKey: "route.adminTenant", featureCode: "tenant.management" },
						},
					],
				},
			],
		},
		{
			path: "/login",
			name: "Login",
			component: () => import("@/views/login/index.vue"),
			meta: { titleKey: "route.login", public: true, requiresAuth: false },
		}
	],
});

const ensureAuthenticated = async () => {
	const token = getToken();

	if (!token?.accessToken) {
		return false;
	}

	if (!isAccessTokenExpired(token)) {
		return true;
	}

	if (!token.refreshToken) {
		removeToken();
		return false;
	}

	try {
		await refreshAccessToken();
		return true;
	} catch {
		removeToken();
		return false;
	}
};

const isPublicRoute = (to: { matched: Array<{ meta: Record<string, unknown> }> }) => {
	return to.matched.some((record) => record.meta.public === true);
};

const requiresAuth = (to: { matched: Array<{ meta: Record<string, unknown> }> }) => {
	return to.matched.some((record) => record.meta.requiresAuth !== false);
};

router.beforeEach(async (to) => {
	const publicRoute = isPublicRoute(to);
	const authRequired = requiresAuth(to);
	const shouldCheckAuth = authRequired || Boolean(getToken()?.accessToken);
	const authenticated = shouldCheckAuth ? await ensureAuthenticated() : false;

	if (publicRoute) {
		if (authenticated && to.path === "/login") {
			return { path: "/dashboard", replace: true };
		}
		return true;
	}

	if (!authRequired) {
		return true;
	}

	if (!authenticated) {
		removeToken();
		return { path: "/login", replace: true };
	}

	return true;
});

export default router;
