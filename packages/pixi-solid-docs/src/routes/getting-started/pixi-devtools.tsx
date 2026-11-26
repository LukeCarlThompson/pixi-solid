import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/getting-started-pixi-devtools-1.tsx?raw";
import { CodeBlock } from "../../components";

export const route = {
  info: {
    label: "Pixi Devtools",
    description: "Setting up Pixi Devtools with Pixi Solid.",
    order: 100,
    sections: [{ id: "attach-to-the-window", title: "Attach to the window" }],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Pixi Devtools</h1>
      <h2 id="attach-to-the-window">Attach to the window</h2>
      <p>
        The <a href="https://pixijs.io/devtools/">PixiJS Devtools</a> are very useful for debugging
        and inspecting your PixiJS applications. For the tools to find your application all you need
        to do it attach it to the window.
      </p>
      <CodeBlock code={snippet1} title="tsx" />
    </article>
  );
}
