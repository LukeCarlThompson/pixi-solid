import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/render-container.demo.tsx?raw";

const RenderContainerDemo = clientOnly(() => import("../../demos/render-container.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Render Container",
    description: "A SolidJS component that renders a PixiJS RenderContainer.",
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
        <h1>Render Container</h1>
        <p>
          A SolidJS component that renders a PixiJS <code>RenderContainer</code>.
        </p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.RenderContainer.html">PixiJS docs</a>{" "}
          for detailed information.
        </p>
        <h2 id="demo">Demo</h2>
        <DemoSection title="render-container">
          <RenderContainerDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="render-container-demo.tsx" />
      </Searchable>
    </Article>
  );
}
