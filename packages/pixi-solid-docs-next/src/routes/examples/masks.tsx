import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/masks.demo.tsx?raw";

const MasksDemo = clientOnly(() => import("../../demos/masks.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Masks",
    description: "An example of using masks in pixi-solid.",
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
      <h1>Masks</h1>
      <p>
        Masks work the same way as in PixiJS. The object being used as a masks needs to be added to
        the <code>Stage</code> and set as a <code>mask</code> property on the object to be masked.
      </p>
      <p>
        Please see the{" "}
        <a href="https://pixijs.com/8.x/guides/components/scene-objects#masking-scene-objects">
          PixiJS docs
        </a>{" "}
        for detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <p>Move your mouse across the screen to change the mask position.</p>
      <DemoSection title="masks">
        <MasksDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="masks-demo.tsx" />
    </article>
  );
}
