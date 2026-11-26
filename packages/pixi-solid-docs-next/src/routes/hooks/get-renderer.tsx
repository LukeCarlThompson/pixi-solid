import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/hooks-get-renderer-1.tsx?raw";
import { CodeBlock } from "../../components";

export const route = {
  info: {
    label: "getRenderer",
    description: "A Solid.js hook to access the root Pixi Renderer instance.",
    order: 2,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "when-to-use-it", title: "When to use it" },
      { id: "relationship-to-other-hooks", title: "Relationship to other hooks" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>getRenderer</h1>
      <p>
        The <code>getRenderer</code> hook provides a way to access the root{" "}
        <code>Pixi.Renderer</code> instance created by the <code>PixiApplicationProvider</code> or{" "}
        <code>PixiCanvas</code> component. This is useful when you need to interact directly with
        the PixiJS renderer, for example, to access renderer properties or perform low-level
        rendering operations.
      </p>
      <h2 id="usage">Usage</h2>
      <p>
        This hook must be called from a component that is a descendant of the{" "}
        <code>
          {"<"}PixiApplicationProvider /{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}PixiCanvas /{">"}
        </code>{" "}
        component. If used outside of this context, it will throw an error.
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="when-to-use-it">When to use it</h2>
      <ul>
        <li>
          <p>
            When you need direct access to the <code>Pixi.Renderer</code> instance for advanced
            rendering operations.
          </p>
        </li>
        <li>
          <p>To query renderer properties such as resolution, or rendering context.</p>
        </li>
        <li>
          <p>
            When you need to perform operations that are specific to the renderer and not covered by
            other <code>pixi-solid</code> utilities.
          </p>
        </li>
      </ul>
      <h2 id="relationship-to-other-hooks">Relationship to other hooks</h2>
      <ul>
        <li>
          <p>
            <code>getPixiApp</code> gives you access to the <code>Pixi.Application</code> instance,
            which contains the renderer as a property. You can access the renderer via{" "}
            <code>getPixiApp().renderer</code>.
          </p>
        </li>
        <li>
          <p>
            <code>getRenderer</code> is a convenience hook that directly accesses the renderer
            without needing to go through the application instance.
          </p>
        </li>
      </ul>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            Read more about the{" "}
            <a href="https://pixijs.com/8.x/guides/components/renderers">
              <code>Pixi.Renderer</code> class
            </a>{" "}
            in the PixiJS documentation.
          </p>
        </li>
      </ul>
    </article>
  );
}
