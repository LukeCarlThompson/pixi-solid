import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/mesh-plane.demo.tsx?raw";

const MeshPlaneDemo = clientOnly(() => import("../../demos/mesh-plane.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Mesh Plane",
    description: "A SolidJS component that renders a PixiJS MeshPlane.",
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
      <h1>Mesh Plane</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>MeshPlane</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.MeshPlane.html">PixiJS docs</a> for
        detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="mesh-plane">
        <MeshPlaneDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="tsx" />
    </article>
  );
}
