import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/text.demo.tsx?raw";

const TextDemo = clientOnly(() => import("../../demos/text.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Text",
    description: "A SolidJS component that renders a PixiJS Text.",
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
      <h1>Text</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>Text</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.Text.html">PixiJS docs</a> for detailed
        information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="text">
        <TextDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="text-demo.tsx" />
    </article>
  );
}
