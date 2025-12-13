import path from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/utils/index.ts"),
      ],
      name: "PixiSolid",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "solid-js/universal", "pixi.js"],
      output: {
        minify: false,
        preserveModules: true,
      },
    },
    target: "es2022",
    sourcemap: true,
  },
});
