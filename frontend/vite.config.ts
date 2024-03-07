import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MyStoryKnight/",
  plugins: [react()],
  preview: {
    port: 3000,
    strictPort: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
