import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/split-text.demo.tsx?raw";
import { href } from "../../href";

const SplitTextDemo = clientOnly(() => import("../../demos/split-text.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Split Text",
    description:
      "A SolidJS component that renders a PixiJS SplitText container for per-character, per-word, and per-line animation.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
      { id: "segment-collections", title: "Segment collections" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Split Text</h1>
      <p>
        <code>SplitText</code> renders text as separate line, word, and character objects. Use the
        exposed <code>chars</code>, <code>words</code>, and <code>lines</code> arrays when you need
        to animate text segments independently.
      </p>
      <p>
        <code>SplitText</code> is a <code>Container</code>, not a sprite, so it does not have an
        outer <code>anchor</code> or <code>anchorX</code>/<code>anchorY</code> prop. Position the
        split text with <code>x</code>, <code>y</code>, or <code>position</code>; use{" "}
        <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> for the
        segment transform origins.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/text.SplitText.html">PixiJS SplitText docs</a>{" "}
        for detailed information about the PixiJS API.
      </p>
      <p>
        <code>SplitText</code> uses regular canvas <code>Text</code> objects for its characters. It
        is a good choice for short, highly styled strings. For long strings or many animated text
        instances, use{" "}
        <a href={href("/components/split-bitmap-text")}>
          <code>SplitBitmapText</code>
        </a>{" "}
        instead.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="split-text">
        <SplitTextDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="split-text-demo.tsx" />
      <h2 id="segment-collections">Segment collections</h2>
      <p>The component exposes three collections:</p>
      <ul>
        <li>
          <p>
            <code>chars</code> contains each character <code>Text</code> instance.
          </p>
        </li>
        <li>
          <p>
            <code>words</code> contains containers for each word.
          </p>
        </li>
        <li>
          <p>
            <code>lines</code> contains containers for each line.
          </p>
        </li>
      </ul>
      <p>
        Set <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> to control
        the transform origin for each collection. <code>autoSplit</code> is enabled by default, so
        changing <code>text</code> or <code>style</code> rebuilds the segment collections.
      </p>
      <CodeBlock
        code={`<SplitText
  text="Animate each character"
  style={{ fontSize: 40, fill: "white" }}
  charAnchor={{ x: 0.5, y: 1 }}
  wordAnchor={{ x: 0, y: 0.5 }}
  lineAnchor={0.5}
/>;`}
        title="tsx"
      />
    </article>
  );
}
