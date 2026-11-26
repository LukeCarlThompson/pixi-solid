import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/graphics.demo.tsx?raw";

const GraphicsDemo = clientOnly(() => import("../../demos/graphics.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Graphics",
    description: "A SolidJS component that renders a PixiJS Graphics.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
      { id: "reading-the-instance", title: "Reading the instance" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Graphics</h1>
      <p>
        A SolidJS component that renders a PixiJS <code>Graphics</code>.
      </p>
      <p>
        Draw with the <code>draw</code> prop. The callback runs once, then again whenever a reactive
        value it reads changes. The instance is cleared before every run, so the callback describes
        the whole content and a re-run replaces the previous drawing:
      </p>
      <CodeBlock
        code={`<Graphics
  draw={(graphics) => {
    graphics.rect(50, 50, 100, 200).fill(0xff0000).circle(200, 200, 50).stroke(0x00ff00);
  }}
/>;`}
        title="tsx"
      />
      <p>Because the callback tracks what it reads, a drawing follows the values it uses:</p>
      <CodeBlock
        code={`import { Graphics } from "pixi-solid";

const Circle = (props: { radius: number }) => (
  <Graphics
    draw={(graphics) => {
      graphics.circle(0, 0, props.radius).fill("#ffd500ff");
    }}
  />
);

// Pass a signal read and the circle redraws when the radius changes.
<Circle radius={radius()} />;`}
        title="tsx"
      />
      <p>
        A value that changes every frame redraws every frame. For per-frame work, animate the
        instance from <code>onTick</code> instead and keep <code>draw</code> for content that
        follows discrete changes.
      </p>
      <h2 id="demo">Demo</h2>
      <DemoSection title="graphics">
        <GraphicsDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="graphics-demo.tsx" />
      <h2 id="reading-the-instance">Reading the instance</h2>
      <p>
        Use <code>ref</code> for anything that is not drawing, such as reading bounds:
      </p>
      <CodeBlock
        code={`let graphics: Pixi.Graphics | undefined;

onSettled(() => {
  const bounds = graphics?.getLocalBounds();
});`}
        title="tsx"
      />
      <p>
        See the <a href="https://pixijs.download/release/docs/scene.Graphics.html">PixiJS docs</a>{" "}
        for the full drawing API.
      </p>
    </article>
  );
}
