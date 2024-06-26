import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { config } from "dotenv";

config();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: process.env.API_BASE_URL!,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
