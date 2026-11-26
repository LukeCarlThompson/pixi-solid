// Fails the build when an internal link points at a page, file or anchor that does not exist.
import fs from "node:fs";
import path from "node:path";

const OUT = "dist/client";
const BASE = "/pixi-solid";

const pages = new Map();

for (const file of walk(OUT)) {
  if (!file.endsWith("index.html")) continue;
  const url = `/${path.relative(OUT, path.dirname(file)).split(path.sep).join("/")}`;
  pages.set(url === "/." ? "/" : url.replace(/\/$/, "") || "/", fs.readFileSync(file, "utf8"));
}

const anchors = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

const problems = [];

for (const [page, html] of pages) {
  for (const { href } of html.matchAll(/href="([^"]+)"/g).map((match) => ({ href: match[1] }))) {
    if (
      !href ||
      ["http://", "https://", "mailto:", "tel:", "data:"].some((s) => href.startsWith(s))
    )
      continue;

    const [target, fragment] = href.startsWith("#")
      ? [page, href.slice(1)]
      : [href.replace(new RegExp(`^${BASE}`), "").replace(/\/$/, "") || "/", ""];

    if (href.startsWith("#")) {
      if (fragment && !anchors(html).has(fragment)) problems.push(`${page}: #${fragment}`);
      continue;
    }

    const [pathname, hash] = target.split("#");
    const key = pathname || "/";

    if (pages.has(key)) {
      if (hash && !anchors(pages.get(key)).has(hash)) problems.push(`${page}: ${href}`);
      continue;
    }

    // A file under the output directory, e.g. an asset, favicon or sitemap.
    const file = path.join(OUT, key);
    if (!fs.existsSync(file)) problems.push(`${page}: ${href}`);
  }
}

function* walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

if (problems.length) {
  console.error(`broken links (${problems.length}):`);
  for (const problem of [...new Set(problems)].slice(0, 40)) console.error(`  ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`${pages.size} pages, all internal links and anchors resolve`);
}
