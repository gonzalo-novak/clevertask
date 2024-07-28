import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";
import { config } from "dotenv";

config();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({ registerType: "autoUpdate", devOptions: { enabled: false } }),
	],
	server: {
		proxy: {
			"/api": {
				target: process.env.API_BASE_URL!,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
