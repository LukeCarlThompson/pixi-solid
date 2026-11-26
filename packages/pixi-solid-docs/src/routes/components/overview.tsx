import type { JSX } from "@solidjs/web";

import snippet4 from "../../code-examples/components-overview-4.tsx?raw";
import snippet5 from "../../code-examples/components-overview-5.tsx?raw";
import { Article, CodeBlock, Searchable, Table } from "../../components";

export const route = {
  info: {
    label: "Overview",
    description: "A page describing the components available in Pixi Solid.",
    order: 1,
    sections: [
      { id: "available-components", title: "Available components" },
      { id: "point-axis-props-by-component", title: "Point-axis props by component" },
      { id: "property-names", title: "Property names" },
      { id: "accessing-the-instance-with-refs", title: "Accessing the instance with Refs" },
      {
        id: "using-a-pre-existing-instance-with-the-as-prop",
        title: "Using a pre-existing instance with the as prop",
      },
      { id: "omissions", title: "Omissions" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Overview</h1>
        <h2 id="available-components">Available components</h2>
        <p>
          Most of the PixiJS display components are available as Solid components in Pixi Solid.
        </p>
        <p>
          All components are named the same as their PixiJS counterparts and should be imported
          individually.
        </p>
        <p>
          This pattern also allows tree shaking, because each component imports only the parts of
          PixiJS that it needs.
        </p>
        <p>
          All of the components take the same props as their PixiJS counterparts, with the addition
          of event handlers.
        </p>
        <p>
          For the purpose, capabilities, and options of each component, see the{" "}
          <a href="https://pixijs.download/release/docs/scene.html">PixiJS docs</a>.
        </p>
        <p>These include:</p>
        <CodeBlock
          code={`import {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  MeshPlane,
  MeshRope,
  NineSliceSprite,
  ParticleContainer,
  PerspectiveMesh,
  RenderContainer,
  RenderLayer,
  Sprite,
  SplitBitmapText,
  SplitText,
  Text,
  TilingSprite,
} from "pixi-solid";`}
          title="ts"
        />
        <p>
          The names clash if you also import classes or types from <code>pixi.js</code> directly.
        </p>
        <p>
          Alias the <code>pixi.js</code> imports in that case:
        </p>
        <CodeBlock
          code={`import { Sprite } from "pixi-solid";
//...
import { Sprite as PixiSprite } from "pixi.js";`}
          title="ts"
        />
        <p>Or import all Pixi types under a namespace. Type-only imports are not bundled:</p>
        <CodeBlock
          code={`import { Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";

//...

let spriteRef: Pixi.Sprite | undefined;
//...`}
          title="ts"
        />
        <h2 id="point-axis-props-by-component">Point-axis props by component</h2>
        <p>
          All components support point-axis shorthand props for fine-grained reactivity. The
          specific axes available depend on the component type:
        </p>
        <Table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Point-axis props</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>Container</code>, <code>RenderContainer</code>, <code>RenderLayer</code>,{" "}
                <code>Graphics</code>, <code>MeshPlane</code>, <code>MeshRope</code>,{" "}
                <code>ParticleContainer</code>, <code>PerspectiveMesh</code>, <code>SplitText</code>
                , <code>SplitBitmapText</code>
              </td>
              <td>
                <code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>,{" "}
                <code>skewX/Y</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>Sprite</code>, <code>Text</code>, <code>BitmapText</code>,{" "}
                <code>HTMLText</code>, <code>NineSliceSprite</code>, <code>AnimatedSprite</code>
              </td>
              <td>
                <code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>,{" "}
                <code>skewX/Y</code>, <code>anchorX/Y</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>TilingSprite</code>
              </td>
              <td>
                <code>positionX/Y</code>, <code>scaleX/Y</code>, <code>pivotX/Y</code>,{" "}
                <code>skewX/Y</code>, <code>anchorX/Y</code>, <code>tilePositionX/Y</code>,{" "}
                <code>tileScaleX/Y</code>
              </td>
            </tr>
          </tbody>
        </Table>
        <h3 id="why-axis-props">Why axis props?</h3>
        <p>
          SolidJS tracks changes by reference. Passing{" "}
          <code>
            position={"{"}
            {"{"} x: 100, y: 200 {"}"}
            {"}"}
          </code>{" "}
          allocates a new object on every update, which both triggers the entire point to rebind and
          creates GC pressure. Axis props like <code>positionX</code> and <code>positionY</code> are
          plain <code>number</code> values — no allocations, and only the changed axis triggers an
          update.
        </p>
        <h2 id="property-names">Property names</h2>
        <p>
          All standard PixiJS properties available on a display object instance (e.g., x, y,
          rotation, alpha, width, height, scale, position, pivot, anchor, skew etc.) are directly
          available as props on the pixi-solid components.
        </p>
        <p>
          In addition to this, pixi-solid enhances these point-based properties (like position,
          scale, pivot, anchor, and skew) by providing individual axis props. This means you can
          control position.x independently using positionX, position.y with positionY, and similarly
          for scaleX, scaleY, pivotX, pivotY, anchorX, anchorY, skewX, and skewY. This allows for
          more granular control over these properties directly through JSX props without needing to
          create a new object for every update.
        </p>
        <h2 id="accessing-the-instance-with-refs">Accessing the instance with Refs</h2>
        <p>
          As with SolidJS and the DOM, you can access the rendered object instance with a{" "}
          <code>ref</code>. In our case this is useful for calling methods on the PixiJS objects or
          interacting directly with PixiJS in an imperative way.
        </p>
        <p>We can use a variable or a callback function to access refs.</p>
        <p>Ref as a variable.</p>
        <CodeBlock code={snippet4} title="tsx" />
        <p>Ref as a callback.</p>
        <CodeBlock code={snippet5} title="tsx" />
        <h2 id="using-a-pre-existing-instance-with-the-as-prop">
          Using a pre-existing instance with the <code>as</code> prop
        </h2>
        <p>
          All pixi-solid components accept an optional <code>as</code> prop to use a{" "}
          <strong>pre-existing PixiJS instance</strong>
          instead of creating a new one. This is useful for sharing a single instance across parts
          of the tree, providing pre-configured instances, or injecting mock instances in tests.
        </p>
        <CodeBlock
          code={`import { Container, Sprite } from "pixi-solid";
import { Container as PixiContainer } from "pixi.js";

const existingContainer = new PixiContainer();
existingContainer.label = "my-container";

const App = () => (
  <Container as={existingContainer}>
    <Sprite texture={Texture.WHITE} />
  </Container>
);`}
          title="tsx"
        />
        <h3 id="lifecycle-note">Lifecycle note</h3>
        <p>
          When <code>as</code> is provided, pixi-solid assumes{" "}
          <strong>you own the instance's lifecycle</strong> and will not destroy it on unmount. You
          must destroy it manually when it is no longer needed.
        </p>
        <CodeBlock
          code={`import { onCleanup } from "solid-js";

const App = () => {
  const existingContainer = new PixiContainer();

  onCleanup(() => {
    existingContainer.destroy({ children: true });
  });

  return (
    <Container as={existingContainer}>
      <Sprite texture={Texture.WHITE} />
    </Container>
  );
};`}
          title="tsx"
        />
        <h2 id="omissions">Omissions</h2>
        <p>
          Some PixiJS classes are deliberately omitted, because wrapping them in a SolidJS component
          does not add much value:
        </p>
        <ul>
          <li>
            <p>
              <code>Particle</code> — Particles inside a <code>ParticleContainer</code> are designed
              for maximum-performance, high-volume imperative updates. A dedicated SolidJS component
              for individual particles contradicts that goal. Create and manage particle instances
              imperatively with a{" "}
              <code>
                {"<"}ParticleContainer /{">"}
              </code>{" "}
              as the parent.
            </p>
          </li>
          <li>
            <p>
              <code>MeshGeometry</code>, <code>NineSliceGeometry</code>,{" "}
              <code>PerspectivePlaneGeometry</code>, <code>PlaneGeometry</code>,{" "}
              <code>RopeGeometry</code> — These are low-level geometry classes used when building
              custom meshes. Create them imperatively with PixiJS and wrap in a custom{" "}
              <code>pixi-solid</code> component when needed.
            </p>
          </li>
          <li>
            <p>
              <code>Culler</code> — May be added in the future; hasn't been evaluated enough to
              determine if a SolidJS component would be useful.
            </p>
          </li>
        </ul>
      </Searchable>
    </Article>
  );
}
