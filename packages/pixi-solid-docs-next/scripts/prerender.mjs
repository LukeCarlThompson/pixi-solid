import fs from "node:fs";
import path from "node:path";

const BASE = "/pixi-solid";
const { handleRequest } = await import("../dist/server/server.js");

/** Route files map one-to-one to URLs in this site: no dynamic segments. */
const routes = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith(".tsx")) continue;

    const route = `/${path.relative("src/routes", full).replace(/\.tsx$/, "")}`.replace(
      /\/index$/,
      "",
    );
    routes.push(route.replace(/\/$/, "") || "/");
  }
};

walk("src/routes");

const strip = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const pages = [];

for (const route of routes.sort((a, b) => a.localeCompare(b))) {
  const response = await handleRequest(new Request(`http://localhost${BASE}${route}`));
  const html = await response.text();

  if (!response.ok) {
    console.error(`FAILED ${route}: ${response.status}`);
    process.exitCode = 1;
    continue;
  }

  const target =
    route === "/"
      ? path.join("dist/client", "index.html")
      : path.join("dist/client", route, "index.html");

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);

  const article =
    (html.match(/<article[^>]*class="ps-prose"[^>]*>([\s\S]*?)<\/article>/) ?? [])[1] ?? html;
  pages.push({ route, article });
}

// The not-found page is reachable but belongs in neither the index nor the sitemap.
const indexed = pages.filter(({ route }) => route !== "/404");

const records = indexed.map(({ route, article }) => {
  const title = strip((article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? route);
  const headings = [...article.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
    .map((match) => strip(match[1]))
    .join(" ");
  // Index prose only: paragraphs and list items, without code, headings or demo chrome.
  const text = [...article.matchAll(/<(p|li)[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((match) => strip(match[2].replace(/<code[^>]*>[\s\S]*?<\/code>/g, " ")))
    .filter(Boolean)
    .join(" ")
    .slice(0, 4000);

  return { id: route, title, headings, text };
});

fs.writeFileSync(path.join("dist/client", "search-index.json"), JSON.stringify(records));

const ORIGIN = "https://lukecarlthompson.github.io";
const urls = indexed
  .map(
    ({ route }) => `  <url><loc>${ORIGIN}${BASE}${route === "/" ? "/" : `${route}/`}</loc></url>`,
  )
  .join("\n");

fs.writeFileSync(
  path.join("dist/client", "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// GitHub Pages serves this file for any path that has no page.
const notFound = path.join("dist/client/404/index.html");
if (fs.existsSync(notFound)) {
  fs.copyFileSync(notFound, path.join("dist/client/404.html"));
}

console.log(
  `prerendered ${pages.length} routes, wrote ${records.length} search records and a sitemap`,
);
