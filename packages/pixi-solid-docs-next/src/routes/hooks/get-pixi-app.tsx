import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/hooks-get-pixi-app-1.tsx?raw";
import { CodeBlock } from "../../components/molecules/CodeBlock";

export const route = {
  info: {
    label: "getPixiApp",
    description: "A Solid.js hook to access the root PIXI.Application instance.",
    order: 1,
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
      <h1>getPixiApp</h1>
      <p>
        The <code>getPixiApp</code> hook accesses the root <code>PIXI.Application</code> instance
        from the nearest <code>PixiApplicationProvider</code> or <code>PixiCanvas</code> component.
        Use it when you need to interact directly with the PixiJS application, for example to access
        the renderer.
      </p>
      <h2 id="usage">Usage</h2>
      <p>
        Call this hook from a component that is a descendant of{" "}
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>
        . If you call it outside this context, it throws an error.
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>
            To access the <code>PIXI.Application</code> instance for operations that{" "}
            <code>pixi-solid</code> components do not cover.
          </p>
        </li>
        <li>
          <p>
            To get information about the PixiJS renderer, such as its dimensions, resolution, or
            view.
          </p>
        </li>
      </ul>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            See the{" "}
            <a href="https://pixijs.com/8.x/guides/components/application">
              <code>PIXI.Application</code> docs
            </a>
            .
          </p>
        </li>
      </ul>
    </article>
  );
}
