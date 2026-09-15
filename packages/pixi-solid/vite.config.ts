import path from "node:path";

import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    pool: "threads",
    isolate: false,
  },
  build: {
    minify: false,
    emptyOutDir: true,
    lib: {
      entry: [
        path.resolve(import.meta.dirname, "src/index.ts"),
        path.resolve(import.meta.dirname, "src/utils/index.ts"),
        path.resolve(import.meta.dirname, "src/testing/index.tsx"),
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
