import { cpSync } from "node:fs";
import path from "node:path";

import type { Plugin } from "vite";
import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

const copySkillFilesPlugin: Plugin = {
  name: "copy-pixi-solid-3d-skill-files",
  apply: "build",
  closeBundle() {
    cpSync(
      path.resolve(import.meta.dirname, "src/skills"),
      path.resolve(import.meta.dirname, "dist/skills"),
      { recursive: true },
    );
  },
};

export default defineConfig({
  plugins: [solidPlugin(), copySkillFilesPlugin],
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts", "tests/**/*.test.tsx"],
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
        "@pixi/3d",
        "@pixi/3d/extras",
        "pixi-solid",
        "pixi-solid/testing",
      ],
      output: {
        preserveModules: true,
      },
    },
    target: "es2022",
    sourcemap: true,
  },
});
