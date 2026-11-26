import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/utils-create-async-delay-1.tsx?raw";
import snippet2 from "../../code-examples/utils-create-async-delay-2.tsx?raw";
import { CodeBlock } from "../../components";

export const route = {
  info: {
    label: "createAsyncDelay",
    description:
      "A Solid.js function for creating an async delay function in sync with the PixiJS Ticker.",
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
      <h1>createAsyncDelay</h1>
      <p>
        <code>createAsyncDelay()</code> returns an async function that delays for a number of
        milliseconds of ticker time.
      </p>
      <p>
        It keeps the delay in sync with the ticker from the nearest context provider, so animations
        and other actions share one clock.
      </p>
      <p>
        Pass an optional <code>AbortSignal</code> to cancel the delay early.
      </p>
      <p>
        Call this function in a SolidJS tracking scope, such as a component, that is a descendant of{" "}
        <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or{" "}
        <code>TickerProvider</code>.
      </p>
      <p>The returned function can be called from an async context.</p>
      <h2 id="usage">Usage</h2>
      <CodeBlock code={snippet1} title="tsx" />
      <h3 id="with-abortsignal">With AbortSignal</h3>
      <p>
        You can pass an <code>AbortSignal</code> to cancel the delay early:
      </p>
      <CodeBlock code={snippet2} title="tsx" />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>When you need to delay execution in a way that is synchronized with the ticker.</p>
        </li>
        <li>
          <p>For animations or other operations that depend on the ticker's timing.</p>
        </li>
        <li>
          <p>
            To avoid using external time measurements like <code>setTimeout</code> in
            ticker-dependent contexts.
          </p>
        </li>
        <li>
          <p>
            When you need the ability to cancel a delay early using an <code>AbortSignal</code>.
          </p>
        </li>
      </ul>
    </article>
  );
}
