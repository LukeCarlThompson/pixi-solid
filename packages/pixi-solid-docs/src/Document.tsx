import type { JSX } from "@solidjs/web";
import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";

/** The document shell in start mode. The plugin injects the client entry tag itself. */
export default function Document(props: ParentProps): JSX.Element {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/pixi-solid/favicon.svg" />
        <link rel="sitemap" type="application/xml" href="/pixi-solid/sitemap.xml" />
        <title>pixi-solid</title>
        <script
          innerHTML={`(() => { try { const stored = localStorage.getItem("ps-theme"); const system = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"; document.documentElement.dataset.theme = stored || system; } catch {} })();`}
        />
        <HydrationScript />
      </head>
      <body>
        <div id="app">{props.children}</div>
      </body>
    </html>
  );
}
