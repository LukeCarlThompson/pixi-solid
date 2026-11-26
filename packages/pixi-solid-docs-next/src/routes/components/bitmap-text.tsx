import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection, Tabs } from "../../components";
import demoCode from "../../demos/bitmap-text.demo.tsx?raw";

const BitmapTextDemo = clientOnly(() => import("../../demos/bitmap-text.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Bitmap Text",
    description: "A SolidJS component that renders a PixiJS BitmapText.",
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
      <h1>Bitmap Text</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>BitmapText</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.BitmapText.html">PixiJS docs</a> for
        detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="bitmap-text">
        <BitmapTextDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <Tabs
        items={[
          {
            label: "sprite-demo.tsx",
            content: (
              <>
                <CodeBlock code={demoCode} title="tsx" />
              </>
            ),
          },
        ]}
      />
    </article>
  );
}
