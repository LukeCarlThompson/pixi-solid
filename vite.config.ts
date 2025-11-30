import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid(),
    dts({
      insertTypesEntry: true,
      outDir: "dist/types",
      exclude: ["**/*.test.ts"],
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "PixiSolid",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["solid-js", "pixi.js"],
      output: {
        // globals are primarily for UMD/IIFE formats. For 'es' format, they are not strictly necessary
        // but harmless if you plan to add other formats later.
        globals: {
          "solid-js": "solid",
          "pixi.js": "PIXI",
        },
      },
    },
  },
});
