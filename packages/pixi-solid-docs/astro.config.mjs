// @ts-check

import path from "path";

import solidJs from "@astrojs/solid-js";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// Get the current working directory to resolve paths correctly
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://astro.build/config
export default defineConfig({
  site: "https://lukecarlthompson.github.io",
  base: "/pixi-solid",
  integrations: [
    starlight({
      title: "Pixi Solid",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/LukeCarlThompson/pixi-solid" },
      ],
      sidebar: [
        {
          label: "Getting started",
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
        {
          label: "Events",
          autogenerate: { directory: "events" },
        },
        {
          label: "Asset loading",
          autogenerate: { directory: "asset-loading" },
        },
        {
          label: "Hooks",
          autogenerate: { directory: "hooks" },
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
      ],
    }),
    solidJs(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
