import type { JSX } from "@solidjs/web";

import { Article, Aside, CodeBlock, Searchable } from "../../components";

export const route = {
  info: {
    label: "Installation",
    description: "Install pixi-solid and its peers, then mount a first canvas.",
    order: 1,
    sections: [
      { id: "requirements", title: "Requirements" },
      { id: "install", title: "Install" },
      { id: "configure", title: "Configure the compiler" },
    ],
  },
};

export default function Install(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Installation</h1>
        <p>
          pixi-solid 2 targets SolidJS 2 and PixiJS 8. Peer dependencies are declared, so you
          install the hosts yourself.
        </p>

        <h2 id="requirements">Requirements</h2>
        <ul>
          <li>SolidJS 2</li>
          <li>PixiJS 8.14 or newer</li>
          <li>
            Vite 8 with <code>@solidjs/vite-plugin</code>
          </li>
        </ul>

        <h2 id="install">Install</h2>
        <CodeBlock code={`npm i pixi-solid`} title="install.sh" lang="bash" />

        <Aside tone="note" title="Peer dependencies">
          <p>
            Solid is a peer, never bundled, and npm installs it with the package. Keep one copy in
            your app so components and your code share the same reactive graph.
          </p>
        </Aside>

        <h2 id="configure">Configure the compiler</h2>
        <p>
          Use Solid 2's Vite plugin. It compiles JSX against the renderer that ships with Solid 2,
          so there is nothing extra to install. Follow Solid's own setup guide if you configure a
          JSX import source yourself.
        </p>
        <CodeBlock
          code={`import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
});`}
          title="vite.config.ts"
          lang="tsx"
        />
      </Searchable>
    </Article>
  );
}
