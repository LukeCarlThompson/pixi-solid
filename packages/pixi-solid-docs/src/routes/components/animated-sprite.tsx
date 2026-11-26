import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable, Table } from "../../components";
import demoCode from "../../demos/animated-sprite.demo.tsx?raw";

const AnimatedSpriteDemo = clientOnly(() => import("../../demos/animated-sprite.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Animated Sprite",
    description: "A SolidJS component that renders a PixiJS AnimatedSprite.",
    order: 100,
    sections: [
      { id: "props", title: "Props" },
      { id: "autoupdate-behavior", title: "autoUpdate behavior" },
      { id: "practical-guidance", title: "Practical guidance" },
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Animated Sprite</h1>
        <p>
          A SolidJS component that renders a PixiJS <code>AnimatedSprite</code>.
        </p>
        <p>
          Please see the{" "}
          <a href="https://pixijs.download/release/docs/scene.AnimatedSprite.html">PixiJS docs</a>{" "}
          for detailed information.
        </p>
        <h2 id="props">Props</h2>
        <p>
          <code>AnimatedSprite</code> accepts all standard sprite props (anchor, event handlers,
          point-axis shorthands) plus the following <code>AnimatedSprite</code>-specific options:
        </p>
        <Table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>textures</code>
              </td>
              <td>
                <code>Pixi.Texture[]</code>
              </td>
              <td>Array of textures to cycle through</td>
            </tr>
            <tr>
              <td>
                <code>playing</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                Whether the animation is currently playing (default <code>true</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>loop</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                Whether the animation loops (default <code>true</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>animationSpeed</code>
              </td>
              <td>
                <code>number</code>
              </td>
              <td>
                Speed multiplier for the animation (default <code>1</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>autoUpdate</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td>
                See autoUpdate behavior below (default <code>true</code>)
              </td>
            </tr>
          </tbody>
        </Table>
        <h2 id="autoupdate-behavior">autoUpdate behavior</h2>
        <p>
          <code>AnimatedSprite</code> in <code>pixi-solid</code> <code>autoUpdate</code> behavior
          intentionally differs from PixiJS defaults to integrate with the <code>pixi-solid</code>{" "}
          ticker context providers.
        </p>
        <p>In PixiJS:</p>
        <ul>
          <li>
            <p>
              <code>AnimatedSprite</code> default behavior or with <code>autoUpdate: true</code>{" "}
              updates itself with the <code>Ticker.shared</code>.
            </p>
          </li>
        </ul>
        <p>
          In <code>pixi-solid</code>:
        </p>
        <ul>
          <li>
            <p>
              <code>AnimatedSprite</code> default behavior or with{" "}
              <code>
                autoUpdate={"{"}true{"}"}
              </code>{" "}
              updates itself with the ticker in the nearest parent <code>Ticker</code> context
              provider. Either a <code>PixiCanvas</code> or <code>TickerProvider</code>.
            </p>
          </li>
        </ul>
        <p>
          This avoids accidentally mixing multiple tickers and makes <code>AnimatedSprite</code>{" "}
          behavior consistent with the rest of the <code>pixi-solid</code> lifecycle utilities.
        </p>
        <h2 id="practical-guidance">Practical guidance</h2>
        <ul>
          <li>
            <p>
              Use the default behavior (omit <code>autoUpdate</code>) for most apps. This keeps
              animation timing bound to your app's configured ticker.
            </p>
          </li>
          <li>
            <p>
              Set{" "}
              <code>
                autoUpdate={"{"}false{"}"}
              </code>{" "}
              and access the instance via a <code>ref</code> and manually call the{" "}
              <code>update</code> method if you want full manual control over frame updates.
            </p>
          </li>
        </ul>
        <h2 id="demo">Demo</h2>
        <DemoSection title="animated-sprite">
          <AnimatedSpriteDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="demo-app.tsx" />
      </Searchable>
    </Article>
  );
}
