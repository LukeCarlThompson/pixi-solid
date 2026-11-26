import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/html-text.demo.tsx?raw";

const HtmlTextDemo = clientOnly(() => import("../../demos/html-text.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "HTML Text",
    description: "A SolidJS component that renders a PixiJS HTMLText.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>HTML Text</h1>
        <p>A SolidJS component that renders a PixiJS HTMLText.</p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.HTMLText.html">PixiJS docs</a> for
          detailed information.
        </p>
        <h2 id="demo">Demo</h2>
        <DemoSection title="html-text">
          <HtmlTextDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="html-text-demo.tsx" />
      </Searchable>
    </Article>
  );
}
