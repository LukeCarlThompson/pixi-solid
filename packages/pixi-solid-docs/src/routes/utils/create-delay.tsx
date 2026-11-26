import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/utils-create-delay-1.tsx?raw";
import { Article, CodeBlock, Searchable } from "../../components";

export const route = {
  info: {
    label: "createDelay",
    description: "Create a callback-based delay function synchronized with the PixiJS Ticker.",
    order: 3,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>createDelay</h1>
        <p>
          The <code>createDelay</code> function creates a callback-based delay function synchronized
          with the nearest ticker context.
        </p>
        <p>
          Call <code>createDelay</code> synchronously inside a descendant of{" "}
          <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or{" "}
          <code>TickerProvider</code>. The returned function captures that ticker and can be called
          later from event handlers, ticker callbacks, async continuations, or nested delay
          callbacks.
        </p>
        <h2 id="usage">Usage</h2>
        <CodeBlock code={snippet1} title="tsx" />
        <h2 id="when-to-use-it">When to use it</h2>
        <ul>
          <li>
            <p>When you need callback-based execution synchronized with ticker time.</p>
          </li>
          <li>
            <p>When you need nested callback delays from event handlers or async continuations.</p>
          </li>
          <li>
            <p>For animations or other operations that depend on ticker timing.</p>
          </li>
          <li>
            <p>
              To replace external time measurements such as <code>setTimeout</code> in
              ticker-dependent contexts.
            </p>
          </li>
        </ul>
      </Searchable>
    </Article>
  );
}
