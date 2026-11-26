import { createRouter, intentPreload } from "@solidjs/router";

import { DocsLayout } from "./components/templates/docs-layout";
import { fileRouteDefinitions } from "./routes";
import NotFound from "./routes/404";

export const routes = [
  {
    path: "/",
    component: DocsLayout,
    children: [...fileRouteDefinitions, { path: "**", component: NotFound }],
  },
];

export const Router = createRouter({
  routes,
  base: import.meta.env.BASE_URL,
  // Warm a link's route chunk while the pointer rests on it.
  preloadLinks: intentPreload(),
});
