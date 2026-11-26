import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/container.demo.tsx?raw";

const ContainerDemo = clientOnly(() => import("../../demos/container.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Container",
    description: "A SolidJS component that renders a PixiJS Container.",
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
      <h1>Container</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>Container</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.Container.html">PixiJS docs</a> for
        detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="container">
        <ContainerDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
