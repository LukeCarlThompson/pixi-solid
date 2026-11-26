import { fileRoutes } from "@solidjs/router/fs";
import { pageRoutes } from "virtual:file-routes";

export type EmittedRoute = {
  path?: string;
  info?: Record<string, unknown> & { filesystem?: boolean };
  children?: readonly EmittedRoute[];
};

export const fileRouteDefinitions = fileRoutes(pageRoutes) as unknown as readonly EmittedRoute[];

export type PageRoute = EmittedRoute & { path: string };

const flatten = (routes: readonly EmittedRoute[], out: PageRoute[] = []): PageRoute[] => {
  for (const route of routes) {
    if (route.info?.filesystem && route.path) out.push(route as PageRoute);
    if (route.children) flatten(route.children, out);
  }

  return out;
};

export const pageEntries = flatten(fileRouteDefinitions);
