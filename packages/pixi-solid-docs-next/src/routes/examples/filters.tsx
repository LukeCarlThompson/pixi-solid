import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/filters.demo.tsx?raw";

const FiltersDemo = clientOnly(() => import("../../demos/filters.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Filters",
    description: "An example of using filters in pixi-solid.",
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
      <h1>Filters</h1>
      <p>
        To use PixiJS filters, instantiate them from the PixiJS classes, then bind the properties
        you want to change to signals.
      </p>
      <p>
        Any PixiJS class you instantiate directly must be destroyed manually when the component is
        cleaned up. The <code>onCleanup</code> hook handles this:
      </p>
      <p>
        Please see the <a href="https://pixijs.download/release/docs/filters.html">PixiJS docs</a>{" "}
        for detailed information.
      </p>
      <h2 id="demo">Demo</h2>
      <p>Move your mouse left to right across the sky to adjust the strength of the blur filter.</p>
      <DemoSection title="filters">
        <FiltersDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code example</h2>
      <CodeBlock code={demoCode} title="filters-demo.tsx" />
    </article>
  );
}
