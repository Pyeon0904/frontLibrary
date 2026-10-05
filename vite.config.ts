import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // shadcn UI 선제작업
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
