import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/sprite.demo.tsx?raw";

const SpriteDemo = clientOnly(() => import("../../demos/sprite.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Sprite",
    description: "A SolidJS component that renders a PixiJS Sprite.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Sprite</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>Sprite</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.Sprite.html">PixiJS docs</a> for
        detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="sprite">
        <SpriteDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="sprite-demo.tsx" />
    </article>
  );
}
