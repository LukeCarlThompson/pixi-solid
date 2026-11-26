import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/instancing.demo.tsx?raw";

const InstancingDemo = clientOnly(() => import("../../demos/instancing.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Instancing",
    description: "Drawing thousands of copies of one geometry with BatchedMesh3D in pixi-solid-3d.",
    order: 6,
    sections: [
      { id: "declaring-a-batch", title: "Declaring a batch" },
      { id: "showing-and-hiding-slots", title: "Showing and hiding slots" },
      { id: "per-slot-shader-values", title: "Per-slot shader values" },
      { id: "reactivity", title: "Reactivity" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Instancing</h1>
        <p>
          <code>
            {"<"}BatchedMesh3D{">"}
          </code>{" "}
          draws many copies of a geometry from one GPU batch, with no scene node per copy. Reach for
          it when a scene has thousands of identical objects: grass, trees, bullets, crowd members,
          voxel tiles.
        </p>
        <p>
          Past a few thousand meshes, a node each costs more to update and draw than the batch
          saves. Below that, plain{" "}
          <code>
            {"<"}Mesh3D{">"}
          </code>{" "}
          is simpler and fast enough.
        </p>
        <p>1,600 cubes in one draw batch. Drag to orbit; the whole grid turns as a single node:</p>
        <DemoSection title="instancing">
          <InstancingDemo fallback={<span />} />
        </DemoSection>
        <CodeBlock code={demoCode} title="instancing.demo.tsx" />
        <h2 id="declaring-a-batch">Declaring a batch</h2>
        <p>
          <code>size</code> is required and fixed for the batch's lifetime. Slots stay allocated
          whether they draw or not, so size the batch to the most you will draw at once.
        </p>
        <CodeBlock
          code={`import type { BaseMaterial3D, Geometry3D } from "@pixi/3d";
import { RenderPassBit } from "@pixi/3d";
import { BatchedMesh3D } from "pixi-solid-3d";

export const Forest = (props: {
  count: number;
  geometry: Geometry3D;
  material: BaseMaterial3D;
}) => (
  <BatchedMesh3D
    size={props.count}
    ref={(batch) => {
      for (let i = 0; i < props.count; i++) {
        batch.setGeometryAt(i, props.geometry);
        batch.setMaterialAt(i, props.material);
        batch.setMatrixAt(i, treeMatrix(i));
        batch.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
      }
    }}
  />
);`}
          title="tsx"
        />
        <p>
          A slot needs a geometry and a material only while it is in a pass, so spare slots can stay
          empty.
        </p>
        <h2 id="showing-and-hiding-slots">Showing and hiding slots</h2>
        <p>To spawn and despawn, show and hide slots instead of adding and removing nodes:</p>
        <CodeBlock
          code={`batch.setVisibleAt(index, false); // despawn
batch.setVisibleAt(index, true); // respawn`}
          title="tsx"
        />
        <p>Moving a slot is a matrix write, cheap enough for every frame:</p>
        <CodeBlock code={`batch.setMatrixAt(index, nextMatrix);`} title="tsx" />
        <h2 id="per-slot-shader-values">Per-slot shader values</h2>
        <p>
          <code>Mesh3D</code> notices when its material's shader changes; a batch slot does not.
          After swapping a material on a slot, call <code>batch.invalidate(index)</code>.
        </p>
        <p>
          For a value that differs per slot, such as a tint or a fade, declare{" "}
          <code>instanceData</code> and write it. A field can hold up to four numbers per slot:
        </p>
        <CodeBlock
          code={`<BatchedMesh3D
  size={count}
  instanceData={{ tint: { value: [1, 1, 1, 1], type: "vec4<f32>" } }}
  ref={(batch) => {
    for (let i = 0; i < count; i++) {
      batch.setInstanceDataAt(i, "tint", 1, 0.2, 0.2, 1);
    }
  }}
/>;`}
          title="tsx"
        />
        <p>
          To rewrite many slots in one pass, write into <code>batch.instanceData.data</code> and
          call
          <code>batch.instanceData.update()</code>.
        </p>
        <h2 id="reactivity">Reactivity</h2>
        <p>
          <code>
            {"<"}BatchedMesh3D{">"}
          </code>{" "}
          binds the same 3D transform and event props as every other scene node, so <code>x</code>,
          <code>scaleZ</code> and <code>onclick</code> work as usual. Slot contents are imperative,
          because the batch holds one buffer for all of them.
        </p>
      </Searchable>
    </Article>
  );
}
