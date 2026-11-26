import type { JSX } from "@solidjs/web";

import snippet2 from "../../code-examples/testing-mount-scene-2.tsx?raw";
import snippet4 from "../../code-examples/testing-mount-scene-4.tsx?raw";
import { CodeBlock } from "../../components";
import { href } from "../../href";

export const route = {
  info: {
    label: "mountScene",
    description:
      "Mount JSX in a temporary Solid root for testing view components that render a Pixi display object.",
    order: 2,
    sections: [
      { id: "basic-usage", title: "Basic usage" },
      { id: "non-container-roots", title: "Non-Container roots" },
      { id: "providing-context", title: "Providing context" },
      { id: "when-to-use", title: "When to use" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>mountScene</h1>
      <p>
        <code>mountScene()</code> is for testing <strong>view components</strong> that render a Pixi
        display object (Sprite, Container, Text, etc.). It mounts JSX in a temporary Solid root,
        resolves it to a real Pixi node, and returns the root Container with query helpers bound to
        it.
      </p>
      <CodeBlock
        code={`type MountSceneResult<TRoot = Pixi.Container> = {
  container: TRoot;
  getByLabel: (label: string) => Pixi.Container;
  queryByLabel: (label: string) => Pixi.Container | undefined;
  getAllByLabel: (label: string) => Pixi.Container[];
  dispose: () => void;
};`}
        title="tsx"
      />
      <p>
        The returned <code>container</code> is the root PixiJS node, so no ref callback is needed to
        access it. It is a snapshot of the root taken right after mounting. If the scene's root node
        can be replaced (a{" "}
        <code>
          {"<"}Loading{">"}
        </code>{" "}
        boundary or a{" "}
        <code>
          {"<"}Show{">"}
        </code>{" "}
        at the top level), prefer the bound query helpers, which always read the current root.
      </p>
      <h2 id="basic-usage">Basic usage</h2>
      <CodeBlock code={snippet2} title="tsx" />
      <h2 id="non-container-roots">Non-Container roots</h2>
      <p>
        For component types other than <code>Pixi.Container</code>, specify the type via the generic
        parameter:
      </p>
      <CodeBlock
        code={`const { container } = mountScene<Pixi.AnimatedSprite>(() => (
  <AnimatedSprite textures={textures} playing />
));
container.playing; // typed as Pixi.AnimatedSprite`}
        title="tsx"
      />
      <h2 id="providing-context">Providing context</h2>
      <p>
        Pass the provider as <code>options.wrapper</code>, or use <code>ctx.mount</code>, which
        applies <code>ctx.Provider</code> for you. The provider supplies a mock ticker (stopped,
        manually controlled), renderer, and app:
      </p>
      <CodeBlock code={snippet4} title="tsx" />
      <h2 id="when-to-use">When to use</h2>
      <ul>
        <li>
          <p>Testing view components that render a Pixi display object</p>
        </li>
        <li>
          <p>You need to inspect the rendered scene graph</p>
        </li>
        <li>
          <p>
            You want to query children by label with <code>getByLabel</code> /{" "}
            <code>queryByLabel</code>
          </p>
        </li>
      </ul>
      <p>
        For testing stores or hooks that do not render a scene, use{" "}
        <a href={href("/testing/render-hook")}>
          <code>renderHook</code>
        </a>{" "}
        instead.
      </p>
    </article>
  );
}
