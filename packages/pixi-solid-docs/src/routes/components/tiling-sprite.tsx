import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/tiling-sprite.demo.tsx?raw";

const TilingSpriteDemo = clientOnly(() => import("../../demos/tiling-sprite.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Tiling Sprite",
    description: "A SolidJS component that renders a PixiJS TilingSprite.",
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
        <h1>Tiling Sprite</h1>
        <p>
          A SolidJS component that renders a PixiJS <code>TilingSprite</code>.
        </p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.TilingSprite.html">PixiJS docs</a> for
          detailed information.
        </p>
        <h2 id="demo">Demo</h2>
        <DemoSection title="tiling-sprite">
          <TilingSpriteDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="tiling-sprite-demo.tsx" />
      </Searchable>
    </Article>
  );
}
