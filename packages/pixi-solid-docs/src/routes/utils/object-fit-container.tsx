import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/object-fit-container.demo.tsx?raw";

const ObjectFitContainerDemo = clientOnly(() => import("../../demos/object-fit-container.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "ObjectFitContainer",
    description:
      "A utility component that scales and aligns children to fit a fixed rectangular area.",
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
      <h1>ObjectFitContainer</h1>
      <p>
        <code>ObjectFitContainer</code> is a utility component from <code>pixi-solid/utils</code>{" "}
        that applies object-fit style scaling and positioning to its children inside a fixed width
        and height region.
      </p>
      <p>
        It is useful for when you want to declare a responsive area and have the children fit within
        that space.
      </p>
      <p>It supports these fit modes:</p>
      <ul>
        <li>
          <p>
            <code>contain</code>
          </p>
        </li>
        <li>
          <p>
            <code>cover</code>
          </p>
        </li>
        <li>
          <p>
            <code>fill</code>
          </p>
        </li>
        <li>
          <p>
            <code>scale-down</code>
          </p>
        </li>
        <li>
          <p>
            <code>none</code>
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
      <p>
        Use the <code>objectPosition</code> prop to set alignment.
      </p>
      <p>
        <code>observeBounds</code> is an optional prop that, when set to <code>true</code>, checks
        the bounds on every tick to watch the container's dimensions and update the layout
        reactively. This has a higher performance cost due to calculating the bounds on every tick
        so should only be used when specifically required. If <code>false</code>, the layout will
        only be calculated on initial render.
      </p>
      <p>Import it from utils:</p>
      <CodeBlock code={`import { ObjectFitContainer } from "pixi-solid/utils";`} title="ts" />
      <h2 id="demo">Demo</h2>
      <p>Use the controls to switch fit mode and position and compare the behavior.</p>
      <DemoSection title="object-fit-container">
        <ObjectFitContainerDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="demo-app.tsx" />
    </article>
  );
}
