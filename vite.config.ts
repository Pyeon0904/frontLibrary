import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
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
  // 백엔드 서버를 위한 JSON 파일이 react app 파일로는 간주되지 않도록
  // => 아래 경로 속 데이터가 수정됐을 때 react app 자체가 리렌더링 발생하지 않도록 함
  server: {
    watch: {
      ignored: ["**/server/**"],
    },
  },
});
