import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/mesh-rope.demo.tsx?raw";

const MeshRopeDemo = clientOnly(() => import("../../demos/mesh-rope.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Mesh Rope",
    description: "A SolidJS component that renders a PixiJS MeshRope.",
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
      <h1>Mesh Rope</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>MeshRope</code>.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.download/release/docs/scene.MeshRope.html">PixiJS docs</a> for
        detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="mesh-rope">
        <MeshRopeDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="tsx" />
    </article>
  );
}
