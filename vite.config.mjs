import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";

export default defineConfig({
  plugins: [gadget(), react()],
  clearScreen: false,
  server: {
    proxy: {
      "/": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
