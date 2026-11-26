import fsSync from "node:fs";
import path from "node:path";

import solidPlugin from "@solidjs/vite-plugin";
import { fileRoutes } from "filesystem-routing/vite";
import type { Plugin, ViteDevServer } from "vite";
import { defineConfig } from "vite";

/**
 * Serves the search index during `vite dev`, where no prebuilt artefact exists. It renders each
 * route through the running dev server, so the text matches the page, and rebuilds when a route
 * changes.
 */
const devSearchIndex = (): Plugin => {
  const strip = (value: string) =>
    value
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

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

  let cache: string | undefined;

  const build = async (server: ViteDevServer): Promise<string> => {
    const port = server.config.server.port ?? 5173;
    const base = server.config.base;
    const records: unknown[] = [];

    for (const route of routes()) {
      const page = await fetch(`http://localhost:${port}${base.replace(/\/$/, "")}${route}`);
      const html = await page.text();
      const article =
        (html.match(/<article[^>]*class="ps-prose"[^>]*>([\s\S]*?)<\/article>/) ?? [])[1] ?? html;
      const title = strip((article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? route);
      const headings = [...article.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
        .map((match) => strip(match[1]))
        .join(" ");
      const text = [...article.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)]
        .map((match) => strip(match[2].replace(/<code[^>]*>[\s\S]*?<\/code>/g, " ")))
        .filter(Boolean)
        .join(" ")
        .slice(0, 4000);

      records.push({ id: route, title, headings, text });
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
    solidPlugin({ start: {}, ssr: true }),
    fileRoutes({ codeSplitting: false }),
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
