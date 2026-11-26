import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/object-fit.demo.tsx?raw";
import { href } from "../../href";

const ObjectFitDemo = clientOnly(() => import("../../demos/object-fit.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "objectFit",
    description:
      "A utility function that imperatively scales and positions a PixiJS container to fit within a rectangular bounds.",
    order: 5,
    sections: [
      { id: "signature", title: "Signature" },
      { id: "usage-in-a-ref", title: "Usage in a ref" },
      { id: "reactive-usage-with-createeffect", title: "Reactive usage with createEffect" },
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>objectFit</h1>
      <p>
        <code>objectFit</code> is a utility function from <code>pixi-solid/utils</code> that
        imperatively applies object-fit style scaling and positioning to any{" "}
        <code>Pixi.Container</code>.
      </p>
      <p>
        Unlike the{" "}
        <a href={href("/utils/object-fit-container")}>
          <code>ObjectFitContainer</code>
        </a>{" "}
        component, which wraps children and manages reactive updates automatically,{" "}
        <code>objectFit</code> is a one-shot imperative call. It is well-suited for use inside{" "}
        <code>ref</code> callbacks, <code>createEffect</code>, event handlers, or anywhere you need
        direct control over when the fit is applied.
      </p>
      <p>It supports these fit modes:</p>
      <ul>
        <li>
          <p>
            <code>contain</code> — scale uniformly to fit within bounds, preserving aspect ratio
          </p>
        </li>
        <li>
          <p>
            <code>cover</code> — scale uniformly to fill bounds, preserving aspect ratio (may clip)
          </p>
        </li>
        <li>
          <p>
            <code>fill</code> — stretch to fill bounds exactly, ignoring aspect ratio
          </p>
        </li>
        <li>
          <p>
            <code>scale-down</code> — same as <code>contain</code> but never scales up beyond
            original size
          </p>
        </li>
        <li>
          <p>
            <code>none</code> — no scaling applied
          </p>
        </li>
      </ul>
      <p>It also supports these positions:</p>
      <ul>
        <li>
          <p>
            <code>center</code> (default)
          </p>
        </li>
        <li>
          <p>
            <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>
          </p>
        </li>
        <li>
          <p>
            <code>top-left</code>, <code>top-right</code>, <code>bottom-left</code>,{" "}
            <code>bottom-right</code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"{"} x: number, y: number {"}"}
            </code>{" "}
            where <code>0</code> is start, <code>0.5</code> is center, and <code>1</code> is end
          </p>
        </li>
      </ul>
      <p>Import it from utils:</p>
      <CodeBlock code={`import { objectFit } from "pixi-solid/utils";`} title="ts" />
      <h2 id="signature">Signature</h2>
      <CodeBlock
        code={`objectFit(
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
  position?: ObjectPosition,
): void`}
        title="ts"
      />
      <p>
        The function mutates <code>object.scale</code>, <code>object.x</code>, and{" "}
        <code>object.y</code> in place. It reads the object's local bounds via{" "}
        <code>getLocalBounds()</code> to determine the original dimensions before scaling.
      </p>
      <h2 id="usage-in-a-ref">Usage in a ref</h2>
      <p>
        The most common use is inside a <code>ref</code> callback to fit a container once on mount:
      </p>
      <CodeBlock
        code={`import { objectFit } from "pixi-solid/utils";

<Graphics
  ref={(graphics) => {
    graphics.rect(0, 0, 200, 100).fill(0xff0000);
    objectFit(graphics, { width: 400, height: 300 }, "contain");
  }}
/>;`}
        title="tsx"
      />
      <h2 id="reactive-usage-with-createeffect">Reactive usage with createEffect</h2>
      <p>
        To re-apply whenever a signal changes, use <code>createEffect</code>:
      </p>
      <CodeBlock
        code={`import { objectFit } from "pixi-solid/utils";
import { createEffect, createSignal } from "solid-js";

const [fitMode, setFitMode] = createSignal("contain");
let graphicsRef;

createEffect(() => {
  if (!graphicsRef) return;
  objectFit(graphicsRef, { width: 400, height: 300 }, fitMode());
});

<Graphics
  ref={(g) => {
    graphicsRef = g;
    g.rect(0, 0, 200, 100).fill(0xff0000);
    objectFit(g, { width: 400, height: 300 }, fitMode());
  }}
/>;`}
        title="tsx"
      />
      <h2 id="demo">Demo</h2>
      <DemoSection title="object-fit">
        <ObjectFitDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
