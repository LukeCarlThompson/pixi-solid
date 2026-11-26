import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/html-and-pixi.demo.tsx?raw";

const HtmlAndPixiDemo = clientOnly(() => import("../../demos/html-and-pixi.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "HTML and PixiJS",
    description: "An example of mixing HTML and PixiJS together.",
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
      <h1>HTML and PixiJS</h1>
      <p>
        This example demonstrates how to combine HTML elements with pixi-solid components and share
        state between them.
      </p>
      <p>
        HTML input controls update SolidJS signals, which then reactively update pixi-solid graphics
        in real-time.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="html-and-pixi">
        <HtmlAndPixiDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="html-and-pixi.demo.tsx" />
    </article>
  );
}
