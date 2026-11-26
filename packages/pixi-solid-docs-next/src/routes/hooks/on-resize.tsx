import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/hooks-on-resize-1.tsx?raw";
import { Aside, CodeBlock } from "../../components";

export const route = {
  info: {
    label: "onResize",
    description:
      "A Solid.js hook that runs a callback function whenever the PixiJS renderer is resized.",
    order: 5,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>onResize</h1>
      <p>
        <code>onResize</code> runs a callback whenever the PixiJS renderer's screen size changes,
        which happens when the browser window resizes or when the element containing{" "}
        <code>PixiCanvas</code> changes size.
      </p>
      <p>
        Call this hook from a descendant of{" "}
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>
        . Outside that context it throws.
      </p>
      <h2 id="usage">Usage</h2>
      <p>
        <code>onResize</code> takes one argument: a <code>resizeCallback</code> function. It
        receives a <code>Pixi.Rectangle</code> with the current <code>width</code>,{" "}
        <code>height</code>, <code>x</code>, and <code>y</code> of the renderer's screen. The
        callback runs immediately on hook initialization, then on every resize event.
      </p>
      <Aside tone="tip" title="Compatibility with usePixiScreen">
        The callback is scheduled via , which means it fires shortly after the renderer's resize
        event — not synchronously during it. This makes sure that store listeners have synchronized
        their reactive values before your callback runs, which avoids stale reads when you use both
        hooks together.
      </Aside>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>
            To dynamically adjust the layout or scale of your PixiJS scene in response to screen
            size changes.
          </p>
        </li>
        <li>
          <p>When implementing responsive design principles for your PixiJS application.</p>
        </li>
        <li>
          <p>
            To recenter elements or reposition UI components when the available rendering area
            changes.
          </p>
        </li>
        <li>
          <p>To re-render or update certain graphics based on the new dimensions.</p>
        </li>
      </ul>
    </article>
  );
}
