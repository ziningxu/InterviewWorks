import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuejsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), vuejsx()],
  build: {
    outDir: 'docs'
  }
});
