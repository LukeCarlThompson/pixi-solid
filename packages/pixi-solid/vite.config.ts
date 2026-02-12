import path from "node:path";
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  build: {
    minify: false,
    emptyOutDir: true,
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/utils/index.ts"),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "solid-js",
        "solid-js/web",
        "solid-js/universal",
        "solid-js/store",
        "solid-js/h",
        "solid-js/html",
        "solid-js/jsx-runtime",
        "solid-js/jsx-dev-runtime",
        "pixi.js",
      ],
      output: {
        preserveModules: true,
      },
    },
    target: "es2022",
    sourcemap: true,
  },
});
