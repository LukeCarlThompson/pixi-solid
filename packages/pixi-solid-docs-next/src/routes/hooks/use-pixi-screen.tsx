import type { JSX } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";

export const route = {
  info: {
    label: "usePixiScreen",
    description: "Solid.js hook for accessing the dimensions of the Pixi application's screen.",
    order: 6,
    sections: [
      { id: "reactive-properties", title: "Reactive properties" },
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>usePixiScreen</h1>
      <p>
        The <code>usePixiScreen</code> hook returns a reactive object containing the current
        dimensions of the Pixi application's screen. Its properties automatically update when the
        renderer's screen size changes, allowing you to build responsive PixiJS applications that
        react to resizing events.
      </p>
      <p>
        It must be called within a component or another hook that is a descendant of either
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>
        .
      </p>
      <h2 id="reactive-properties">Reactive properties</h2>
      <p>
        The returned object provides the following properties, all of which update automatically on
        resize:
      </p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>width</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>Screen width in pixels</td>
          </tr>
          <tr>
            <td>
              <code>height</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>Screen height in pixels</td>
          </tr>
          <tr>
            <td>
              <code>x</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>Screen x-offset</td>
          </tr>
          <tr>
            <td>
              <code>y</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>Screen y-offset</td>
          </tr>
          <tr>
            <td>
              <code>left</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>
              Alias for <code>x</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>right</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>
              <code>x + width</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>top</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>
              Alias for <code>y</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>bottom</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>
              <code>y + height</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 id="usage">Usage</h2>
      <CodeBlock
        code={`import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const ResponsiveSprite = (props: { texture: Pixi.Texture }) => {
  const screen = usePixiScreen();

  return (
    <Sprite
      texture={props.texture}
      anchor={0.5}
      x={screen.width / 2}
      y={screen.height / 2}
      scale={
        Math.min(screen.width / props.texture.width, screen.height / props.texture.height) * 0.5
      }
    />
  );
};

const App = () => (
  <PixiCanvas>
    <ResponsiveSprite texture={Pixi.Texture.WHITE} />
  </PixiCanvas>
);`}
        title="tsx"
      />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>When you need to get the current dimensions of the PixiJS renderer screen.</p>
        </li>
        <li>
          <p>
            When you want to create components that automatically adapt to changes in the Pixi
            application's size.
          </p>
        </li>
        <li>
          <p>For positioning elements relative to the screen dimensions.</p>
        </li>
        <li>
          <p>As a reactive source for calculations based on the application's viewport.</p>
        </li>
      </ul>
    </article>
  );
}
