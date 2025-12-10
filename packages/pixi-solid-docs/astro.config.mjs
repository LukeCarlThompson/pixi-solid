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
      ],
    }),
    solidJs(),
  ],
  vite: {
    ssr: {
      // Force SolidJS itself to be processed internally for consistent module resolution
      noExternal: ["solid-js"],
      // Externalize your library during SSR.
      // This tells Astro/Vite to *not* bundle your library for the server build,
      // expecting it to be a Node.js module that can be required, or ignored if client-only.
      external: ["pixi-solid"],
    },
    resolve: {
      // Ensure 'solid' condition is prioritized when resolving modules,
      // which helps SolidJS pick the correct environment-specific exports.
      conditions: ["solid", "browser", "development"],
    },
  },
});
