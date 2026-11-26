import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/asset-loading-individual-assets-1.tsx?raw";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { href } from "../../href";

export const route = {
  info: {
    label: "Loading Individual Assets",
    description:
      "How to load individual assets in a pixi-solid application with an async memo and a loading boundary.",
    order: 1,
    sections: [
      { id: "example-loading-a-single-image", title: "Example: Loading a Single Image" },
      { id: "further-reading", title: "Further reading" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Loading Individual Assets</h1>
      <p>
        Async work is a computation that returns a Promise. Return one from <code>createMemo</code>{" "}
        and read it inside a{" "}
        <code>
          {"<"}Loading{">"}
        </code>{" "}
        boundary. Pair it with the PixiJS <code>Assets</code> class to load assets.
      </p>
      <h2 id="example-loading-a-single-image">Example: Loading a Single Image</h2>
      <p>This example loads a single background image for a scene.</p>
      <CodeBlock code={snippet1} title="tsx" />
      <p>
        Because the memo returns the texture, reading it both waits for the load and supplies the
        value, and no{" "}
        <code>
          {"<"}Show{">"}
        </code>{" "}
        is needed. When a load produces many assets that the scene reads individually, gate it with
        a boolean instead. See <a href={href("/asset-loading/asset-manifest")}>asset manifests</a>.
      </p>
      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <p>
            See <a href={href("/asset-loading/asset-manifest")}>asset manifests</a> for loading
            several assets together.
          </p>
        </li>
        <li>
          <p>
            See the{" "}
            <a href="https://pixijs.com/8.x/guides/components/assets">PixiJS Assets guide</a> for
            details.
          </p>
        </li>
      </ul>
    </article>
  );
}
