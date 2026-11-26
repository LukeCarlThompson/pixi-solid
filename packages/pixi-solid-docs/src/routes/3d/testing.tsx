import type { JSX } from "@solidjs/web";

import snippet1 from "../../code-examples/3d-testing-1.tsx?raw";
import snippet3 from "../../code-examples/3d-testing-3.tsx?raw";
import { CodeBlock } from "../../components";

export const route = {
  info: {
    label: "Testing 3D Scenes",
    description:
      "Headless tests for pixi-solid-3d scenes, using mountScene from pixi-solid/testing and the 3D label queries.",
    order: 100,
    sections: [
      { id: "scene-queries", title: "Scene queries" },
      { id: "ticker-driven-components", title: "Ticker-driven components" },
      { id: "what-to-assert", title: "What to assert" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Testing 3D Scenes</h1>
      <p>
        A 3D scene tests like a 2D one:{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        needs no canvas, renderer or WebGL context. Mount with
        <code>mountScene</code> from <code>pixi-solid/testing</code>, query with the 3D helpers from{" "}
        <code>pixi-solid-3d/testing</code>, and assert on the nodes themselves.
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="scene-queries">Scene queries</h2>
      <p>
        <code>pixi-solid-3d/testing</code> exports three queries. They walk the whole scene in one
        pass: 2D containers, into every{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        (whose 3D nodes hang off <code>view.root</code>), and on through its 3D nodes.
      </p>
      <table>
        <thead>
          <tr>
            <th>Helper</th>
            <th>Returns</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>getByLabel3D(root, …)</code>
            </td>
            <td>The first match; throws when there is none</td>
          </tr>
          <tr>
            <td>
              <code>queryByLabel3D(root, …)</code>
            </td>
            <td>
              The first match, or <code>undefined</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>getAllByLabel3D(root, …)</code>
            </td>
            <td>Every match, in depth-first order</td>
          </tr>
        </tbody>
      </table>
      <p>
        Any of them accepts a 2D container, a{" "}
        <code>
          {"<"}View3D{">"}
        </code>
        , or a{" "}
        <code>
          {"<"}Container3D{">"}
        </code>{" "}
        as the root, and the root itself is a candidate, so{" "}
        <code>getByLabel3D(view, "main-view")</code> finds a labelled{" "}
        <code>
          {"<"}View3D{">"}
        </code>
        .
      </p>
      <p>
        The returned node type is what you say it is — the walk cannot know which class a label
        belongs to:
      </p>
      <CodeBlock
        code={`import type * as Pixi3D from "@pixi/3d";

const crate = getByLabel3D<Pixi3D.Mesh3D>(container, "crate");
expect(crate?.geometry).toBeInstanceOf(Pixi3D.CubeGeometry);`}
        title="tsx"
      />
      <h2 id="ticker-driven-components">Ticker-driven components</h2>
      <p>
        <code>
          {"<"}Model3D{">"}
        </code>
        ,{" "}
        <code>
          {"<"}ParticleSystem3D{">"}
        </code>
        ,{" "}
        <code>
          {"<"}OrbitCamera{">"}
        </code>{" "}
        and{" "}
        <code>
          {"<"}FPSCamera{">"}
        </code>{" "}
        advance on the ticker from context rather than <code>Ticker.shared</code>. Wrap the scene in{" "}
        <code>ctx.Provider</code> from <code>createTestContext()</code> and step frames on{" "}
        <code>ctx.ticker</code>:
      </p>
      <CodeBlock code={snippet3} title="tsx" />
      <h2 id="what-to-assert">What to assert</h2>
      <p>
        Nodes expose the same properties the components write, so assert those directly:{" "}
        <code>mesh.position.x</code>,<code>node.children</code>, <code>view.camera</code> for the
        active camera, and <code>instance.destroyed</code> after unmount.
      </p>
      <p>
        <code>cleanup()</code> disposes every mounted scene, including the{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        that owns its view. A view passed in through <code>as</code> is adopted, never destroyed.
      </p>
    </article>
  );
}
