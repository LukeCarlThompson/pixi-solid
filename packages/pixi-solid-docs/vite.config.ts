import fsSync from "node:fs";
import path from "node:path";

import solidPlugin from "@solidjs/vite-plugin";
import { fileRoutes } from "filesystem-routing/vite";
import { formatSitemap } from "prerender-crawler";
import type { PrerenderIntegration } from "prerender-crawler";
import { prerender } from "prerender-crawler/vite";
import type { Plugin, ViteDevServer } from "vite";
import { defineConfig } from "vite";

import { buildRecords, routeOf } from "./src/search-index.ts";

/** Route files map one-to-one to URLs: no dynamic segments. */
const routes = (): string[] => {
  const found: string[] = [];
  const walk = (directory: string) => {
    for (const entry of fsSync.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".tsx")) continue;
      found.push(
        `/${path.relative("src/routes", full).replace(/\.tsx$/, "")}`.replace(/\/index$/, "") ||
          "/",
      );
    }
  };
  walk("src/routes");
  return found.sort((a, b) => a.localeCompare(b));
};

const BASE = "/pixi-solid";
const SITE_ROOT = "https://lukecarlthompson.github.io/pixi-solid/";

/** Prebuilt pages, each with the filename GitHub Pages should serve it from. */
const prerenderPages = () =>
  routes()
    .filter((route) => route !== "/404")
    .map((route) => ({
      path: route === "/" ? `${BASE}/` : `${BASE}${route}/`,
      filename: route === "/" ? "index.html" : `${route.slice(1)}/index.html`,
    }))
    .concat([{ path: `${BASE}/404/`, filename: "404.html" }]);

/**
 * Emits the sitemap. The crawl works in paths without the deployment base, so each entry is
 * resolved against the published origin instead of joined to a bare hostname.
 */
const sitemap = (): PrerenderIntegration => ({
  name: "sitemap",
  teardown(context) {
    const entries = context.pages
      .filter((page) => routeOf(page.path) !== "/404")
      .map((page) => {
        const path = routeOf(page.path);

        return { loc: path === "/" ? SITE_ROOT : new URL(`${path.slice(1)}/`, SITE_ROOT).href };
      });

    context.emitFile({ filename: "sitemap.xml", contents: formatSitemap(entries) });
  },
});

/** Emits the MiniSearch payload from the pages the crawl rendered. */
const searchIndex = (): PrerenderIntegration => ({
  name: "search-index",
  teardown(context) {
    const records = buildRecords(context.pages.map(({ path, html }) => ({ path, html })));
    const unindexed = records.filter((record) => record.text.length === 0);

    if (unindexed.length > 0) {
      throw new Error(
        `no <Searchable> content on: ${unindexed.map((record) => record.id).join(", ")}`,
      );
    }

    context.emitFile({ filename: "search-index.json", contents: JSON.stringify(records) });
  },
});

/**
 * Serves the search index during `vite dev`, where no prebuilt artefact exists. It renders each
 * route through the running dev server, so the text matches the page, and rebuilds when a route
 * changes.
 */
const devSearchIndex = (): Plugin => {
  let cache: string | undefined;

  const build = async (server: ViteDevServer): Promise<string> => {
    const port = server.config.server.port ?? 5173;
    const base = server.config.base;
    const records: unknown[] = [];

    for (const route of routes()) {
      const page = await fetch(`http://localhost:${port}${base.replace(/\/$/, "")}${route}`);
      const html = await page.text();
      records.push(...buildRecords([{ path: route, html }]));
    }

    cache = JSON.stringify(records);
    return cache;
  };

  return {
    name: "dev-search-index",
    apply: "serve",
    configureServer(server) {
      server.watcher.on("change", (file) => {
        if (file.includes("/src/routes/")) cache = undefined;
      });

      server.middlewares.use((request, response, next) => {
        if (!request.url?.endsWith("/search-index.json")) {
          next();
          return;
        }

        const send = (body: string) => {
          response.setHeader("Content-Type", "application/json");
          response.end(body);
        };

        if (cache) {
          send(cache);
          return;
        }

        void build(server).then(send, (error: unknown) => next(error as Error));
      });
    },
  };
};

/**
 * Highlights inline code samples. Pages write `code`...`` beside the prose, and this swaps the
 * tagged template for the rendered HTML before the browser ever sees it.
 */
export default defineConfig({
  base: "/pixi-solid/",
  plugins: [
    devSearchIndex(),
    solidPlugin({ start: true, ssr: true, extensions: [".jsx", ".tsx"] }),
    fileRoutes({ types: true }),
    prerender({
      mode: "static",
      crawlLinks: false,
      pages: prerenderPages,
      integrations: [sitemap(), searchIndex()],
    }),
  ],
  build: { target: "es2022", manifest: true },
  // The demo is imported dynamically, so Vite would discover `pixi.js` after the page loaded,
  // re-optimise mid-session and hand the page a stale dependency URL. Include it up front and keep
  // the linked workspace package out of the optimizer.
  optimizeDeps: {
    include: ["pixi.js", "minisearch"],
    exclude: ["pixi-solid"],
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
    dedupe: ["solid-js", "@solidjs/web", "pixi.js"],
  },
  ssr: { noExternal: ["pixi-solid", "pixi.js"] },
});
