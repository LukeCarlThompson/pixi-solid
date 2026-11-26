import type { JSX } from "@solidjs/web";

import { CodeBlock } from "../../components/molecules/CodeBlock";

export const route = {
  info: {
    label: "getTicker",
    description: "Solid.js hook for accessing the PixiJS Ticker.",
    order: 3,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>getTicker</h1>
      <p>
        The <code>pixi-solid</code> library provides two hooks, <code>getTicker</code> and{" "}
        <code>onTick</code>, to interact with the PixiJS <code>Ticker</code> instance.
      </p>
      <p>
        The <code>getTicker</code> hook provides direct access to the <code>PIXI.Ticker</code>{" "}
        instance from the current application context. This is useful when you need imperative
        control over the ticker, such as pausing, starting, or adjusting its speed globally. The
        hook must be called from a component that is a descendant of either{" "}
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>
        .
      </p>
      <h2 id="usage">Usage</h2>
      <CodeBlock
        code={`import { getTicker, onTick, Container, PixiCanvas } from "pixi-solid";
import { createEffect, createSignal } from "solid-js";

const MyComponent = () => {
  const [tickerRunning, setTickerRunning] = createSignal(true);
  const ticker = getTicker();

  createEffect(() => {
    // You can now safely use the PixiJS Ticker instance
    console.log("PixiJS Ticker instance:", ticker);

    // Example: start and stop the ticker based on a signal
    if (tickerRunning()) {
      ticker.start();
    } else {
      ticker.stop();
    }
  });

  return <Container>{/* Your components here*/}</Container>;
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <MyComponent />
    </PixiCanvas>
  );
};`}
        title="tsx"
      />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>
            When you need to globally control the animation loop (e.g., stopping or starting all
            animations).
          </p>
        </li>
        <li>
          <p>To adjust the overall speed or framerate of the application.</p>
        </li>
        <li>
          <p>To add or remove ticker callbacks dynamically based on complex logic.</p>
        </li>
      </ul>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            Read more about the{" "}
            <a href="https://pixijs.com/8.x/guides/components/ticker">
              <code>Pixi.Ticker</code> class
            </a>{" "}
            in the PixiJS documentation.
          </p>
        </li>
      </ul>
    </article>
  );
}
