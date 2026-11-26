import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import snippet1 from "../../code-examples/3d-meshes-and-materials-1.tsx?raw";
import snippet5 from "../../code-examples/3d-meshes-and-materials-5.tsx?raw";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/meshes-and-materials.demo.tsx?raw";

const MeshesAndMaterialsDemo = clientOnly(() => import("../../demos/meshes-and-materials.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Meshes and Materials",
    description:
      "Creating 3D geometries and PBR materials in pixi-solid-3d with automated GPU resource lifecycle management.",
    order: 100,
    sections: [
      {
        id: "1-declarative-nested-components-automatic-disposal",
        title: "1. Declarative Nested Components (Automatic Disposal)",
      },
      { id: "changing-size-and-changing-shape", title: "Changing size, and changing shape" },
      {
        id: "2-instantiated-object-props-resource-sharing",
        title: "2. Instantiated Object Props (Resource Sharing)",
      },
      { id: "summary-of-lifecycles", title: "Summary of Lifecycles" },
      { id: "available-declarative-geometries", title: "Available Declarative Geometries" },
      { id: "available-declarative-materials", title: "Available Declarative Materials" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Meshes and Materials</h1>
      <p>
        <code>pixi-solid-3d</code> provides{" "}
        <code>
          {"<"}Mesh3D{">"}
        </code>{" "}
        to render 3D geometry combined with materials.
      </p>
      <p>Four geometries and all four material types, on a turntable:</p>
      <DemoSection title="meshes-and-materials">
        <MeshesAndMaterialsDemo fallback={<span />} />
      </DemoSection>
      <CodeBlock code={demoCode} title="meshes-and-materials.demo.tsx" />
      <p>
        In 3D rendering engines like PixiJS 3D, GPU resources (buffers, textures, and shader
        pipeline descriptors) are expensive to allocate. <code>pixi-solid-3d</code> gives you two
        ways to work with geometries and materials:
      </p>
      <ol>
        <li>
          <p>
            <strong>Declarative Nested Components</strong>{" "}
            <em>(Recommended for component-scoped resources)</em>: Material options stay live, and
            the resource is <strong>disposed automatically</strong> on unmount.
          </p>
        </li>
        <li>
          <p>
            <strong>Instantiated Object Props</strong>{" "}
            <em>(Recommended for shared / global resources)</em>: Pass pre-created class instances
            where <strong>you retain ownership</strong> and manage lifecycle.
          </p>
        </li>
      </ol>
      <hr />
      <h2 id="1-declarative-nested-components-automatic-disposal">
        1. Declarative Nested Components (Automatic Disposal)
      </h2>
      <p>
        When geometries and materials are placed as direct JSX children of{" "}
        <code>
          {"<"}Mesh3D{">"}
        </code>
        , <code>pixi-solid-3d</code> manages their lifecycle for you. When the component unmounts or
        conditionally swaps, it calls <code>.destroy()</code> automatically.
      </p>
      <p>
        Furthermore, updating properties like <code>roughness</code>, <code>metallic</code>, or{" "}
        <code>baseColor</code> updates the existing GPU material directly with zero allocations.
      </p>
      <CodeBlock code={snippet1} title="tsx" />
      <h2 id="changing-size-and-changing-shape">Changing size, and changing shape</h2>
      <p>
        A geometry's options are read when it is built — <code>@pixi/3d</code> turns them into
        vertex buffers and keeps no settable copy — so changing a geometry option after mount does
        not reshape it. Materials are the opposite: their options are live fields, so{" "}
        <code>
          {"<"}Material3D roughness={"{"}roughness(){"}"} /{">"}
        </code>{" "}
        follows the signal.
      </p>
      <p>
        To make something bigger, <strong>scale the mesh</strong>. That is a transform, so it costs
        nothing and updates every frame:
      </p>
      <CodeBlock
        code={`<Mesh3D scaleX={width()} origin={{ x: 0.5, y: 0.5, z: 0.5 }}>
  <CubeGeometry width={1} height={1} depth={1} />
  <Material3D baseColor="#38bdf8" />
</Mesh3D>;`}
        title="tsx"
      />
      <p>
        To change the shape itself — segments, radius, a different geometry altogether — mount a new
        geometry. Inside{" "}
        <code>
          {"<"}Mesh3D{">"}
        </code>
        ,{" "}
        <code>
          {"<"}Show keyed{">"}
        </code>{" "}
        remounts it and disposes the old one:
      </p>
      <CodeBlock
        code={`<Show keyed when={detail()}>
  {(detail) => <SphereGeometry radius={1} widthSegments={detail} heightSegments={detail} />}
</Show>;`}
        title="tsx"
      />
      <p>
        Scaling is not always equivalent: anything that reads vertex positions, such as the dissolve
        bit's holes, works in the geometry's stored units and therefore scales with the mesh. Those
        need a rebuilt geometry, which is why the two are separate operations.
      </p>
      <h3 id="conditional-swapping-with-or">
        Conditional Swapping with{" "}
        <code>
          {"<"}Show{">"}
        </code>{" "}
        or{" "}
        <code>
          {"<"}Switch{">"}
        </code>
      </h3>
      <p>
        You can conditionally swap materials or geometries using standard SolidJS primitives. When
        the condition flips, the old material is automatically destroyed, and the new one takes its
        place:
      </p>
      <CodeBlock
        code={`<Mesh3D>
  <CubeGeometry width={2} />
  <Show when={isHovered()} fallback={<Material3D baseColor="#38bdf8" roughness={0.5} />}>
    <Material3D baseColor="#ff4f4c" roughness={0.1} />
  </Show>
</Mesh3D>;`}
        title="tsx"
      />
      <hr />
      <h2 id="2-instantiated-object-props-resource-sharing">
        2. Instantiated Object Props (Resource Sharing)
      </h2>
      <p>
        If you have a geometry or material that is <strong>shared across hundreds of meshes</strong>{" "}
        (e.g., enemy particles, terrain tiles, or trees in a forest), you should create a single
        instance outside the component tree and pass it as a prop.
      </p>
      <p>
        When passed as a prop, <code>pixi-solid-3d</code> treats it as <strong>user-owned</strong>{" "}
        and will <strong>never</strong> destroy it when an individual mesh unmounts:
      </p>
      <CodeBlock code={snippet5} title="tsx" />
      <hr />
      <h2 id="summary-of-lifecycles">Summary of Lifecycles</h2>
      <table>
        <thead>
          <tr>
            <th>Usage Pattern</th>
            <th>Syntax</th>
            <th>Who Owns Cleanup?</th>
            <th>When is it Destroyed?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Nested JSX Child</strong>
            </td>
            <td>
              <code>
                {"<"}Mesh3D{">"}
                {"<"}CubeGeometry /{">"}
                {"<"}Material3D /{">"}
                {"<"}/Mesh3D{">"}
              </code>
            </td>
            <td>
              <code>pixi-solid-3d</code>
            </td>
            <td>Automatically on unmount / condition change</td>
          </tr>
          <tr>
            <td>
              <strong>Direct Prop</strong>
            </td>
            <td>
              <code>
                {"<"}Mesh3D geometry={"{"}geom{"}"} material={"{"}mat{"}"} /{">"}
              </code>
            </td>
            <td>Caller / Application</td>
            <td>
              When caller manually calls <code>geom.destroy()</code>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <h2 id="available-declarative-geometries">Available Declarative Geometries</h2>
      <ul>
        <li>
          <p>
            <code>
              {"<"}CubeGeometry width={"{"}...{"}"} height={"{"}...{"}"} depth={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}SphereGeometry radius={"{"}...{"}"} widthSegments={"{"}...{"}"} heightSegments=
              {"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}PlaneGeometry width={"{"}...{"}"} height={"{"}...{"}"} /{">"}
            </code>{" "}
            — lies in XY with a +Z normal, so a quarter turn on X makes it a floor
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}CylinderGeometry radiusTop={"{"}...{"}"} radiusBottom={"{"}...{"}"} height={"{"}
              ...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}ConeGeometry radius={"{"}...{"}"} height={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}CapsuleGeometry radius={"{"}...{"}"} height={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}TorusGeometry radius={"{"}...{"}"} tube={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}TorusKnotGeometry radius={"{"}...{"}"} tube={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}IcosahedronGeometry radius={"{"}...{"}"} /{">"}
            </code>
          </p>
        </li>
      </ul>
      <h2 id="available-declarative-materials">Available Declarative Materials</h2>
      <ul>
        <li>
          <p>
            <code>
              {"<"}Material3D baseColor={"{"}...{"}"} roughness={"{"}...{"}"} metallic={"{"}...{"}"}{" "}
              normalTexture={"{"}...{"}"} /{">"}
            </code>{" "}
            — PBR metallic-roughness material.
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}FlatMaterial baseColor={"{"}...{"}"} baseColorTexture={"{"}...{"}"} /{">"}
            </code>{" "}
            — Unlit flat color or texture.
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}PhongMaterial baseColor={"{"}...{"}"} specularColor={"{"}...{"}"} shininess={"{"}
              ...{"}"} /{">"}
            </code>{" "}
            — Classic Blinn-Phong material.
          </p>
        </li>
        <li>
          <p>
            <code>
              {"<"}ToonMaterial baseColor={"{"}...{"}"} bands={"{"}...{"}"} outline={"{"}...{"}"} /
              {">"}
            </code>{" "}
            — Cel-shaded stylized toon material.
          </p>
        </li>
      </ul>
    </article>
  );
}
