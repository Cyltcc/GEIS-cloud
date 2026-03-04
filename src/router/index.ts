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
							component: () => import("@/views/DeviceGroup.vue"),
							meta: { title: "设备分组" },
						},
						{
							path: "list",
							name: "DeviceList",
							component: () => import("@/views/DeviceList.vue"),
							meta: { title: "设备列表" },
						},
						{
							path: "favorites",
							name: "DeviceFavorites",
							component: () => import("@/views/DeviceList.vue"), // Placeholder
							meta: { title: "设备收藏" },
						},
					],
				},
				{
					path: "data-mgmt",
					name: "DataMgmt",
					component: () => import("@/views/Dashboard.vue"), // Placeholder
					meta: { title: "数据管理" },
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
