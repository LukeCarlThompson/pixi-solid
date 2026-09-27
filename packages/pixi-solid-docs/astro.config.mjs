// @ts-check

import path from "path";

import starlight from "@astrojs/starlight";
import solidPlugin from "@solidjs/vite-plugin";
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
  ],
  vite: {
    // `@solidjs/vite-plugin` types against Vite 8 while Astro 6 ships Vite 7. The plugin
    // declares `^6 || ^7 || ^8` and runs on Vite 7; only the bundled type definitions differ.
    // @ts-expect-error cross-version Plugin type mismatch (remove when Astro ships Vite 8)
    plugins: [solidPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
