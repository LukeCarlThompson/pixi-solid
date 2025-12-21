// @ts-check

import solidJs from "@astrojs/solid-js";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://lukecarlthompson.github.io/pixi-solid",
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
          label: "Asset loading",
          autogenerate: { directory: "asset-loading" },
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
});
