import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import Unocss from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")
	const proxyTarget = env.VITE_PROXY_TARGET || "http://10.20.0.13:8080/api/v1"
	const apiProxy = {
		"/api": {
			target: proxyTarget,
			changeOrigin: true,
			secure: true,
			rewrite: (path: string) => path.replace(/^\/api/, ""),
		},
	}

	return {
		plugins: [vue(), Unocss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			}
		},
		server: {
			proxy: apiProxy,
		},
		preview: {
			proxy: apiProxy,
		},
	}
});
