import type { JSX } from "@solidjs/web";

import { Article, Aside, CodeBlock, Searchable, Table } from "../../components";

export const route = {
  info: {
    label: "useScreenToWorld",
    description:
      "Reactively unproject 2D screen coordinates into 3D world space against a plane or ray distance.",
    order: 100,
    sections: [
      { id: "usage", title: "Usage" },
      { id: "parameters", title: "Parameters" },
      { id: "context-requirement", title: "Context requirement" },
      { id: "return-value", title: "Return Value" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>useScreenToWorld</h1>
        <p>
          <code>useScreenToWorld</code> is a reactive SolidJS hook that takes a 2D screen coordinate
          (such as mouse cursor or touch point) and unprojects it into 3D world space against a
          given 3D <code>Plane</code> (like a floor or wall) or along the camera ray.
        </p>
        <h2 id="usage">Usage</h2>
        <CodeBlock
          code={`import { Plane, Vector3 } from "@pixi/3d";
import { useScreenToWorld, Mesh3D } from "pixi-solid-3d";
import { createSignal, Show } from "solid-js";

export const GroundReticle = () => {
  const [screenPos, setScreenPos] = createSignal({ x: 400, y: 300 });
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0); // y = 0

  // Reactively unprojects screen coordinates onto the 3D ground plane
  const worldPos = useScreenToWorld(screenPos, groundPlane);

  return (
    <Show when={worldPos()}>
      {(pos) => (
        <Mesh3D
          x={pos().x}
          y={pos().y}
          z={pos().z}
          geometry={circleGeometry}
          material={reticleMaterial}
        />
      )}
    </Show>
  );
};`}
          title="tsx"
        />
        <h2 id="parameters">Parameters</h2>
        <Table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>screenPoint</code>
              </td>
              <td>
                <code>
                  PointData | Accessor{"<"}PointData{">"}
                </code>
              </td>
              <td>The 2D screen position to unproject</td>
            </tr>
            <tr>
              <td>
                <code>target</code>
              </td>
              <td>
                <code>
                  Plane | number | Accessor{"<"}...{">"}
                </code>
              </td>
              <td>
                A 3D <code>Plane</code> to intersect with, or a number representing distance along
                the ray
              </td>
            </tr>
          </tbody>
        </Table>
        <h2 id="context-requirement">Context requirement</h2>
        <p>
          <code>useScreenToWorld</code> reads the ambient <code>View3DContext</code>. Call it inside{" "}
          <code>
            {"<"}View3D{">"}
          </code>
          , or anywhere within a{" "}
          <code>
            {"<"}View3DProvider{">"}
          </code>{" "}
          (including sibling 2D overlays). Calling it outside both throws:
        </p>
        <Aside tone="warning">
          <p>
            <code>
              useScreenToWorld must be used within a {"<"}View3D{">"}, a {"<"}View3DProvider{">"},
              or a component mounted inside one.
            </code>
          </p>
        </Aside>
        <p>
          <code>
            {"<"}View3DProvider{">"}
          </code>{" "}
          creates the <code>View3D</code> up front, so the hook always has an instance to unproject
          through. The result becomes meaningful once the scene is built and the camera is in the
          graph, which happens during the first tick after mount.
        </p>
        <h2 id="return-value">Return Value</h2>
        <p>
          Returns an Accessor to{" "}
          <code>
            {"{"} x: number, y: number, z: number {"}"} | null
          </code>
          . Returns <code>null</code> if the ray misses or is parallel to the target plane.
        </p>
      </Searchable>
    </Article>
  );
}
