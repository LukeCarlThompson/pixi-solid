/** One page in the search payload. Produced at build, read by the dialog. */
export type SearchRecord = {
  id: string;
  title: string;
  headings: string;
  text: string;
};

/** Drops tags and entities, keeping the words a reader sees. */
const strip = (value: string): string =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** The page path as the site knows it: no base, no trailing slash. */
export const routeOf = (path: string): string =>
  path.replace(/^\/pixi-solid/, "").replace(/\/$/, "") || "/";

/** Content of the element carrying `data-search`, matched by tag depth so nested divs survive. */
const searchableContent = (html: string): string | undefined => {
  const open = /<div[^>]*data-search[^>]*>/.exec(html);
  if (!open) return undefined;

  const start = open.index + open[0].length;
  const tags = /<\/?div\b/g;
  tags.lastIndex = start;

  let depth = 1;
  for (let match = tags.exec(html); match; match = tags.exec(html)) {
    depth += match[0] === "</div" ? -1 : 1;
    if (depth === 0) return html.slice(start, match.index);
  }

  return undefined;
};

/** Builds the payload from rendered pages. Shared by the build integration and dev. */
export const buildRecords = (pages: readonly { path: string; html: string }[]): SearchRecord[] =>
  pages
    .filter(({ path }) => routeOf(path) !== "/404")
    .map(({ path, html }) => {
      const article = searchableContent(html) ?? "";
      const title = strip(article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? path);
      const headings = [...article.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
        .map((match) => strip(match[1]))
        .join(" ");
      // Prose only: paragraphs and list items, without code, headings or demo chrome.
      const text = [...article.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)]
        .map((match) => strip(match[2].replace(/<code[^>]*>[\s\S]*?<\/code>/g, " ")))
        .filter(Boolean)
        .join(" ")
        .slice(0, 4000);

      return { id: routeOf(path), title, headings, text };
    });

/** Narrows parsed JSON to the payload shape, so a stale or wrong file fails visibly. */
export const isSearchPayload = (value: unknown): value is SearchRecord[] =>
  Array.isArray(value) &&
  value.every(
    (record) =>
      typeof record === "object" &&
      record !== null &&
      typeof (record as SearchRecord).id === "string" &&
      typeof (record as SearchRecord).title === "string" &&
      typeof (record as SearchRecord).headings === "string" &&
      typeof (record as SearchRecord).text === "string",
  );
