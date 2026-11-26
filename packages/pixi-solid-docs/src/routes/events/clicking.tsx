import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Aside, CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/clicking.demo.tsx?raw";

const ClickingDemo = clientOnly(() => import("../../demos/clicking.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Clicking",
    description: "An example of using click events in pixi-solid.",
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
      <h1>Clicking</h1>
      <p>
        An example of using the <code>onclick</code> event handler on a pixi-solid element.
      </p>
      <Aside tone="note">
        The <code>onclick</code> event is for mouse clicks only, use <code>ontap</code> for only
        touch events or <code>onpointertap</code>
        for both mouse and touch events.
      </Aside>
      <h2 id="demo">Demo</h2>
      <DemoSection title="clicking">
        <ClickingDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
