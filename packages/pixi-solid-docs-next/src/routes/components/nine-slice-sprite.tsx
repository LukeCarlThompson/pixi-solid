import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/nine-slice-sprite.demo.tsx?raw";

const NineSliceSpriteDemo = clientOnly(() => import("../../demos/nine-slice-sprite.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Nine Slice Sprite",
    description: "A SolidJS component that renders a PixiJS NineSliceSprite.",
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
      <h1>Nine Slice Sprite</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>NineSliceSprite</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.NineSliceSprite.html">PixiJS docs</a>{" "}
        for detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="nine-slice-sprite">
        <NineSliceSpriteDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="tsx" />
    </article>
  );
}
