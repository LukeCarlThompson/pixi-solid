import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/getting-started-application-instantiation-1.tsx?raw";
import snippet2 from "../../code-examples/getting-started-application-instantiation-2.tsx?raw";
import { Aside } from "../../components/molecules/Aside";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { href } from "../../href";

export const route = {
  info: {
    label: "Creating a Pixi Application",
    description: "How to get started with pixi-solid.",
    order: 100,
    sections: [{ id: "pixicanvas", title: "PixiCanvas" }],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Creating a Pixi Application</h1>
      <h2 id="pixicanvas">PixiCanvas</h2>
      <p>
        The <code>PixiCanvas</code> component is the primary way to set up a PixiJS application in
        pixi-solid. It handles creating and managing the HTML canvas element, the Pixi Application
        instance, and provides context to child components.
      </p>
      <h3 id="simple-standalone-usage">Simple Standalone Usage</h3>
      <p>
        The simplest way to get started is to use <code>PixiCanvas</code> directly:
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <h3 id="with-html-components">With HTML Components</h3>
      <p>
        For use cases where you need HTML components outside the canvas to access pixi-solid hooks,
        wrap with <code>PixiApplicationProvider</code>:
      </p>
      <CodeBlock code={snippet2} title="tsx" />
      <Aside tone="tip">
        When using <code>PixiApplicationProvider</code>, HTML components placed between the provider
        and canvas can access pixi-solid hooks and the Pixi application context.
      </Aside>
      <p>
        <strong>For complete API documentation and more examples</strong>, see the{" "}
        <a href={href("/components/pixi-canvas")}>PixiCanvas component reference</a>.
      </p>
      <Aside tone="warning">
        The <code>pixi-solid</code> library only supports client side rendering. So you may need to
        use the <code>lazy</code>
        function to dynamically import only on the client or use the <code>clientOnly</code>{" "}
        function if using Solid Start.
      </Aside>
    </article>
  );
}
