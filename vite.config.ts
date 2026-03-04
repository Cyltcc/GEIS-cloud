import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import Unocss from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), Unocss()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "https://api.thcreate.com/v1",
				changeOrigin: true,
				secure: true
			}
		}
	},
	preview: {
		proxy: {
			"/api": {
				target: "https://api.thcreate.com/v1",
				changeOrigin: true,
				secure: true
			}
		}
	}
});
