import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/render-layer.demo.tsx?raw";

const RenderLayerDemo = clientOnly(() => import("../../demos/render-layer.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Render Layer",
    description: "A SolidJS component that renders a PixiJS RenderLayer.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Render Layer</h1>
        <p>
          A SolidJS component that renders a PixiJS <code>RenderLayer</code>.
        </p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.RenderLayer.html">PixiJS docs</a> for
          detailed information.
        </p>
        <h2 id="demo">Demo</h2>
        <DemoSection title="render-layer">
          <RenderLayerDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="render-layer-demo.tsx" />
      </Searchable>
    </Article>
  );
}
