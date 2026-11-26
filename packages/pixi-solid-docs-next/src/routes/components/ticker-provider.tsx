import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/components-ticker-provider-1.tsx?raw";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { href } from "../../href";

export const route = {
  info: {
    label: "TickerProvider",
    description: "Provide an alternate PixiJS Ticker to a scene graph subtree.",
    order: 4,
    sections: [
      { id: "example", title: "Example" },
      { id: "props", title: "Props" },
      { id: "when-to-use-it", title: "When to use it" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>TickerProvider</h1>
      <p>
        <code>TickerProvider</code> supplies a <code>Pixi.Ticker</code> to descendants through
        context. It does not create or add anything to the Pixi scene graph.
      </p>
      <p>
        <code>PixiCanvas</code> and <code>PixiApplicationProvider</code> already provide ticker
        context. Use <code>TickerProvider</code> when a scene graph branch needs a different ticker
        instance. Descendants can use <code>onTick</code>, <code>createDelay</code>,{" "}
        <code>createAsyncDelay</code>, and <code>getTicker</code> with that ticker.
      </p>
      <h2 id="example">Example</h2>
      <p>This branch runs at half speed while the rest of the scene uses the canvas ticker.</p>
      <CodeBlock code={snippet1} title="tsx" />
      <h3 id="props">Props</h3>
      <ul>
        <li>
          <p>
            <code>ticker: Pixi.Ticker</code> - The ticker instance to provide to child components
            (required)
          </p>
        </li>
        <li>
          <p>
            <code>children: JSX.Element</code> - The child components that will have access to the
            ticker context
          </p>
        </li>
      </ul>
      <h3 id="when-to-use-it">When to use it</h3>
      <p>
        <code>TickerProvider</code> is an edge-case provider. Use it when:
      </p>
      <ul>
        <li>
          <p>
            A scene graph branch needs an independently managed ticker, such as a different rate or
            clock.
          </p>
        </li>
        <li>
          <p>An existing ticker owned by another system must drive a branch.</p>
        </li>
        <li>
          <p>
            A non-standard integration must populate ticker context outside the normal application
            provider tree.
          </p>
        </li>
      </ul>
      <p>
        For normal scenes, use <code>PixiCanvas</code> or <code>PixiApplicationProvider</code>. For
        tests, use <code>createManualTicker</code> and <code>createTestContext</code> instead.
      </p>
      <p>
        The caller owns the ticker passed to <code>TickerProvider</code>. Create, start, stop, and
        destroy it outside the provider when appropriate.
      </p>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            Read more about the{" "}
            <a href="https://pixijs.com/8.x/guides/components/ticker">
              <code>Pixi.Ticker</code> class
            </a>{" "}
            in the PixiJS documentation
          </p>
        </li>
        <li>
          <p>
            See related hooks:{" "}
            <a href={href("/hooks/on-tick")}>
              <code>onTick</code>
            </a>
            ,{" "}
            <a href={href("/hooks/get-ticker")}>
              <code>getTicker</code>
            </a>
            ,{" "}
            <a href={href("/utils/create-delay")}>
              <code>createDelay</code>
            </a>
            ,{" "}
            <a href={href("/utils/create-async-delay")}>
              <code>createAsyncDelay</code>
            </a>
          </p>
        </li>
      </ul>
    </article>
  );
}
