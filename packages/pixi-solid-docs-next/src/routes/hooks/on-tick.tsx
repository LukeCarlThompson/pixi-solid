import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/hooks-on-tick-1.tsx?raw";
import { CodeBlock } from "../../components/molecules/CodeBlock";

export const route = {
  info: {
    label: "onTick",
    description: "Solid.js hook for subscribing and unsubscribing to the PixiJS Ticker.",
    order: 4,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>onTick</h1>
      <p>
        The <code>onTick</code> hook registers a callback function that runs on every frame of the
        PixiJS ticker.
        <code>onTick</code> automatically adds the callback to the ticker when it first runs and
        removes it when the hook's owning scope is cleaned up.
      </p>
      <p>
        Call <code>onTick</code> within a SolidJS tracking scope. This scope must be a descendant of{" "}
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>
        ,{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>
        , or{" "}
        <code>
          {"<"}TickerProvider /{">"}
        </code>
        .
      </p>
      <h2 id="usage">Usage</h2>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>
            To subscribe to the ticker for the lifetime of a SolidJS tracking scope (component or{" "}
            <code>createEffect</code>).
          </p>
        </li>
        <li>
          <p>
            To run code on each ticker update without managing <code>ticker.add</code> and{" "}
            <code>ticker.remove</code> directly.
          </p>
        </li>
        <li>
          <p>
            To create continuous animations, movement, or other frame-by-frame updates within a
            component.
          </p>
        </li>
      </ul>
    </article>
  );
}
