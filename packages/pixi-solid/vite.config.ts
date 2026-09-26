import { cpSync } from "node:fs";
import path from "node:path";

import type { Plugin } from "vite";
import solidPlugin from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

const copySkillFilesPlugin: Plugin = {
  name: "copy-pixi-solid-skill-files",
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
        "@solidjs/web",
        "@solidjs/web/jsx-runtime",
        "@solidjs/web/jsx-dev-runtime",
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
