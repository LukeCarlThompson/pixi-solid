// @ts-check

import solidJs from "@astrojs/solid-js";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://github.com/LukeCarlThompson/pixi-solid",
  integrations: [
    starlight({
      title: "Pixi Solid Docs",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/LukeCarlThompson/pixi-solid" },
      ],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
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
