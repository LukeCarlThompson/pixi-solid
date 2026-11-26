import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/perspective-mesh.demo.tsx?raw";

const PerspectiveMeshDemo = clientOnly(() => import("../../demos/perspective-mesh.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Perspective Mesh",
    description: "A SolidJS component that renders a PixiJS PerspectiveMesh.",
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
      <h1>Perspective Mesh</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>PerspectiveMesh</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.PerspectiveMesh.html">PixiJS docs</a>{" "}
        for detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="perspective-mesh">
        <PerspectiveMeshDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="perspective-mesh-demo.tsx" />
    </article>
  );
}
