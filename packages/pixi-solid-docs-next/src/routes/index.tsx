import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoFrame, Tabs } from "../components";
import characterSource from "../demos/home-page-demo/character.tsx?raw";
import controlsSource from "../demos/home-page-demo/controls/index.tsx?raw";
import controlsStyles from "../demos/home-page-demo/controls/style.module.css?raw";
import texturesSource from "../demos/home-page-demo/get-animation-textures.ts?raw";
import appSource from "../demos/home-page-demo/index.tsx?raw";
import assetsSource from "../demos/home-page-demo/load-scene-assets.ts?raw";
import storeSource from "../demos/home-page-demo/player-store.ts?raw";
import { href } from "../href";

import styles from "./index.module.scss";

const install = `npm i pixi-solid pixi.js solid-js`;

const HomeDemo = clientOnly(() => import("../demos/home-page.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Introduction",
    description: "Docs and examples for pixi-solid, a SolidJS renderer for PixiJS.",
    order: 1,
  },
};

export default function Home(): JSX.Element {
  return (
    <div class={styles.home}>
      <section class={styles.hero}>
        <p class={styles.eyebrow}>SolidJS 2 · PixiJS 8</p>
        <h1 class={styles.title}>
          PixiJS scenes, <span class={styles.accent}>written as JSX.</span>
        </h1>
        <p class={styles.lede}>
          pixi-solid renders every major PixiJS display object as a component, so your scene graph
          is reactive, typed, and testable without a browser.
        </p>

        <div class={styles.actions}>
          <a class={styles.primary} href={href("/getting-started/install")}>
            Get started
          </a>
          <a class={styles.secondary} href={href("/components/container")}>
            See a component
          </a>
        </div>

        <pre class={styles.install}>
          <code>{install}</code>
        </pre>
      </section>

      <section class={styles.features} aria-label="Why pixi-solid">
        <article>
          <h2>Signals drive the scene</h2>
          <p>Props bind to Pixi objects, one effect per key, so an update touches one property.</p>
        </article>
        <article>
          <h2>Cleanup is automatic</h2>
          <p>Components destroy the instances they own and detach the ones they do not.</p>
        </article>
        <article>
          <h2>Testable headless</h2>
          <p>Context, hooks and ticker run without a GPU, so scenes mount in jsdom.</p>
        </article>
      </section>

      <section class={styles.demo} aria-label="Live demo">
        <HomeDemo fallback={<DemoFrame ratio="16 / 9" label="Live demo" />} />
      </section>

      <section aria-label="Code example">
        <h2 class={styles.sectionTitle}>Code example</h2>
        <Tabs
          items={[
            { label: "app.tsx", content: <CodeBlock code={appSource} title="app.tsx" /> },
            {
              label: "player-store.ts",
              content: <CodeBlock code={storeSource} title="player-store.ts" />,
            },
            {
              label: "character.tsx",
              content: <CodeBlock code={characterSource} title="character.tsx" />,
            },
            {
              label: "textures.ts",
              content: <CodeBlock code={texturesSource} title="get-animation-textures.ts" />,
            },
            {
              label: "assets.ts",
              content: <CodeBlock code={assetsSource} title="load-scene-assets.ts" />,
            },
            {
              label: "controls.tsx",
              content: <CodeBlock code={controlsSource} title="controls/index.tsx" />,
            },
            {
              label: "style.module.css",
              content: <CodeBlock code={controlsStyles} title="controls/style.module.css" />,
            },
          ]}
        />
      </section>
    </div>
  );
}
