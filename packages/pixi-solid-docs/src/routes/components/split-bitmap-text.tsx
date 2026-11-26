import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import snippet1 from "../../code-examples/components-split-bitmap-text-1.tsx?raw";
import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/split-bitmap-text.demo.tsx?raw";
import { href } from "../../href";

const SplitBitmapTextDemo = clientOnly(() => import("../../demos/split-bitmap-text.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Split Bitmap Text",
    description:
      "A SolidJS component that renders a PixiJS SplitBitmapText container for efficient per-character, per-word, and per-line animation.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
      { id: "bitmap-fonts", title: "Bitmap fonts" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Split Bitmap Text</h1>
      <p>
        <code>SplitBitmapText</code> renders text as separate bitmap text segments. Use the exposed{" "}
        <code>chars</code>, <code>words</code>, and <code>lines</code> arrays when you need to
        animate many text segments efficiently.
      </p>
      <p>
        <code>SplitBitmapText</code> is a <code>Container</code>, not a sprite, so it does not have
        an outer <code>anchor</code> or <code>anchorX</code>/<code>anchorY</code> prop. Position the
        split text with <code>x</code>, <code>y</code>, or <code>position</code>; use{" "}
        <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> for the
        segment transform origins.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/text.SplitBitmapText.html">
          PixiJS SplitBitmapText docs
        </a>{" "}
        for detailed information about the PixiJS API.
      </p>
      <p>
        <code>SplitBitmapText</code> uses a bitmap font atlas. Install or load the font before
        rendering the component. It is a good choice for long strings, frequently changing text, or
        many simultaneous per-character animations.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="split-bitmap-text">
        <SplitBitmapTextDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="split-bitmap-text-demo.tsx" />
      <h2 id="bitmap-fonts">Bitmap fonts</h2>
      <p>
        Install a bitmap font before creating <code>SplitBitmapText</code>:
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <p>
        The component exposes the same <code>chars</code>, <code>words</code>, <code>lines</code>,{" "}
        <code>autoSplit</code>, and transform-origin props as{" "}
        <a href={href("/components/split-text")}>
          <code>SplitText</code>
        </a>
        . The character segments use bitmap text, so they inherit BitmapText's font atlas and glyph
        coverage requirements.
      </p>
    </article>
  );
}
