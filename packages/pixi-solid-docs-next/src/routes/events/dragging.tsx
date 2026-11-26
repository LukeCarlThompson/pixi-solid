import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/dragging.demo.tsx?raw";

const DraggingDemo = clientOnly(() => import("../../demos/dragging.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Dragging",
    description: "An example of using events for dragging behavior in pixi-solid.",
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
      <h1>Dragging</h1>
      <p>An example of using event handlers to create dragging functionality.</p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="dragging">
        <DraggingDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
