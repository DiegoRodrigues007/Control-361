import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env.VITE_GOOGLE_MAPS_KEY": JSON.stringify(
        env.VITE_GOOGLE_MAPS_KEY
      ),
      "process.env.VITE_APP_BASE_URL": JSON.stringify(env.VITE_APP_BASE_URL),
      "process.env.VITE_APP_API_TOKEN": JSON.stringify(env.VITE_APP_API_TOKEN),
    },
  };
});
