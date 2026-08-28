import { defineStore } from "pinia";
import type { userType } from './types';
import { store } from "@/store";


export const useUserStore = defineStore("user", {
	state: (): userType => ({
		// 用户名
		username: "",
		// 页面级别权限
		roles: [],
		// 用户信息
		info: {},
		// 前端生成的验证码（按实际需求替换）
		verifyCode: "",
		// 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
		currentPage: 0
	}),
	actions: {
		/** 存储用户名 */
		SET_USERNAME(username: string) {
			this.username = username;
		},
		/** 存储角色 */
		SET_ROLES(roles: Array<string>) {
			this.roles = roles;
		},
		/** 存储前端生成的验证码 */
		SET_VERIFYCODE(verifyCode: string) {
			this.verifyCode = verifyCode;
		},
		/** 存储登录页面显示哪个组件 */
		SET_CURRENTPAGE(value: number) {
			this.currentPage = value;
		},
	}
})

export function useUserStoreHook() {
	return useUserStore(store);
}
