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
  markdown: {
    gfm: true,
  },
  integrations: [
    starlight({
      title: "Pixi Solid",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/LukeCarlThompson/pixi-solid" },
      ],
      sidebar: [
        {
          label: "Getting started",
          items: [{ autogenerate: { directory: "getting-started" } }],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Events",
          items: [{ autogenerate: { directory: "events" } }],
        },
        {
          label: "Asset loading",
          items: [{ autogenerate: { directory: "asset-loading" } }],
        },
        {
          label: "Hooks",
          items: [{ autogenerate: { directory: "hooks" } }],
        },
        {
          label: "Utils",
          items: [{ autogenerate: { directory: "utils" } }],
        },
        {
          label: "Examples",
          items: [{ autogenerate: { directory: "examples" } }],
        },
        {
          label: "Testing",
          items: [{ autogenerate: { directory: "testing" } }],
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
