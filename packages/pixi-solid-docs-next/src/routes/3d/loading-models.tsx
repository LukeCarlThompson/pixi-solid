import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/model-3d.demo.tsx?raw";

const Model3dDemo = clientOnly(() => import("../../demos/model-3d.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Loading 3D Models",
    description:
      "Loading glTF and GLB models with Assets.load and rendering them using Model3D in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "how-model-loading-works", title: "How Model Loading Works" },
      { id: "interactive-demo", title: "Interactive Demo" },
      { id: "code-example", title: "Code Example" },
      { id: "instantiating-named-scenes", title: "Instantiating Named Scenes" },
      { id: "shadows-and-transforms", title: "Shadows and Transforms" },
      {
        id: "customizing-model-materials-traverse",
        title: "Customizing Model Materials (traverse)",
      },
      { id: "per-model-material-overrides", title: "Per-model material overrides" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Loading 3D Models</h1>
      <p>
        <code>pixi-solid-3d</code> provides the{" "}
        <code>
          {"<"}Model3D{">"}
        </code>{" "}
        component to instantiate and render 3D scenes loaded from standard <strong>glTF</strong> and{" "}
        <strong>GLB</strong> files.
      </p>
      <h2 id="how-model-loading-works">How Model Loading Works</h2>
      <ol>
        <li>
          <p>
            Load your <code>.gltf</code> or <code>.glb</code> file using PixiJS's{" "}
            <code>
              Assets.load{"<"}Scene3DSource{">"}()
            </code>
            .
          </p>
        </li>
        <li>
          <p>
            Wrap the loader with SolidJS's <code>createResource</code> to handle the asynchronous
            loading state reactively.
          </p>
        </li>
        <li>
          <p>
            Pass the resulting <code>source</code> to{" "}
            <code>
              {"<"}Model3D source={"{"}source(){"}"} /{">"}
            </code>
            .
          </p>
        </li>
      </ol>
      <p>
        Multiple{" "}
        <code>
          {"<"}Model3D{">"}
        </code>{" "}
        instances can share the exact same <code>Scene3DSource</code> without duplicating GPU
        textures or geometry buffers.
      </p>
      <h2 id="interactive-demo">Interactive Demo</h2>
      <p>
        Here is a 3D Knight model loaded from a <code>.glb</code> file, rendered with directional
        and spot lighting. Click and drag across the canvas to smoothly rotate the character to face
        your pointer:
      </p>
      <DemoSection title="model-3d">
        <Model3dDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code Example</h2>
      <CodeBlock code={demoCode} title="model-3d.demo.tsx" />
      <h2 id="instantiating-named-scenes">Instantiating Named Scenes</h2>
      <p>
        If your glTF file contains multiple scenes, specify which one to instantiate using the{" "}
        <code>scene</code> prop:
      </p>
      <CodeBlock code={`<Model3D source={source()} scene="Showroom" />;`} title="tsx" />
      <h2 id="shadows-and-transforms">Shadows and Transforms</h2>
      <p>
        <code>
          {"<"}Model3D{">"}
        </code>{" "}
        supports the full set of 3D transform props (<code>x</code>, <code>y</code>, <code>z</code>,{" "}
        <code>scale</code>, <code>rotation</code>, etc.) and shadow options:
      </p>
      <CodeBlock
        code={`<Model3D source={source()} x={0} y={0} z={-5} scale={1.5} castShadow={true} receiveShadow={true} />;`}
        title="tsx"
      />
      <h2 id="customizing-model-materials-traverse">
        Customizing Model Materials (<code>traverse</code>)
      </h2>
      <p>
        When a 3D model loads, <code>@pixi/3d</code> builds an internal hierarchy of{" "}
        <code>Mesh3D</code> nodes from the glTF file. To inspect or customize individual meshes
        (such as swapping materials, adjusting roughness, or setting shadow properties), use the{" "}
        <code>traverse</code> prop:
      </p>
      <CodeBlock
        code={`import { Mesh3D } from "@pixi/3d";
import { Model3D, ToonMaterial } from "pixi-solid-3d";

export const CustomKnight = (props: { source: any }) => {
  return (
    <Model3D
      source={props.source}
      traverse={(node) => {
        if (node instanceof Mesh3D) {
          // Customize all meshes or target specific parts by name
          if (node.label === "Sword") {
            node.material = new ToonMaterial({ bands: 4 });
          }
        }
      }}
    />
  );
};`}
        title="tsx"
      />
      <p>
        Every <code>Container3D</code> has <code>traverse(callback)</code>, which visits the node
        and every descendant depth first. Call it imperatively on a node when the{" "}
        <code>traverse</code> prop is not enough:
      </p>
      <CodeBlock
        code={`const model = new Model3D({ source });

model.traverse((node) => {
  if (node instanceof Mesh3D) node.castShadow = true;
});`}
        title="tsx"
      />
      <h2 id="per-model-material-overrides">Per-model material overrides</h2>
      <p>
        Every{" "}
        <code>
          {"<"}Model3D{">"}
        </code>{" "}
        built from the same <code>Scene3DSource</code> draws the <strong>same</strong> material
        instances. Changing a property on one writes through to every model built from that source:
      </p>
      <CodeBlock
        code={`// Affects every model made from this source
armorMesh.material.roughness = 0.9;`}
        title="tsx"
      />
      <p>
        When a model needs materials of its own, pass <code>materials</code>. <code>@pixi/3d</code>{" "}
        calls it once per source material, so meshes that shared a material still share its
        replacement:
      </p>
      <CodeBlock
        code={`import { Material3D } from "@pixi/3d";
import { Model3D } from "pixi-solid-3d";

// By material label, using the names in the glTF file
<Model3D source={source()} materials={{ Paint: new Material3D({ baseColor: 0xff2222 }) }} />;

// By source material index; leave an entry out to keep the source's material
<Model3D source={source()} materials={[undefined, glowMaterial]} />;

// Build a private copy of every material
<Model3D source={source()} materials={(material) => material.clone()} />;`}
        title="tsx"
      />
      <p>
        <code>materials</code> is a setter on <code>Model3D</code>, so you can swap overrides from a
        signal, for example when a model takes damage. Assigning <code>undefined</code> gives the
        model the source's materials back.
      </p>
      <p>
        <code>
          {"<"}Model3D{">"}
        </code>{" "}
        never destroys the materials you pass in. Destroy the ones you created when you are done
        with them, or pass{" "}
        <code>
          destroy({"{"} material: true {"}"})
        </code>{" "}
        yourself.
      </p>
    </article>
  );
}
