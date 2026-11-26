import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, Aside, CodeBlock, DemoSection, Searchable, Table } from "../../components";
import demoCode from "../../demos/picking.demo.tsx?raw";
import { href } from "../../href";

const PickingDemo = clientOnly(() => import("../../demos/picking.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "Picking and Pointer Events",
    description:
      "Making 3D meshes clickable and hoverable, and reading the surface point a pointer hit, in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "demo", title: "Demo" },
      { id: "code-example", title: "Code example" },
      { id: "making-a-node-pickable", title: "Making a node pickable" },
      { id: "what-the-pointer-hit", title: "What the pointer hit" },
      { id: "handler-names", title: "Handler names" },
      { id: "picking-without-an-event", title: "Picking without an event" },
      { id: "turning-picking-off", title: "Turning picking off" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Picking and Pointer Events</h1>
        <p>
          3D nodes take the same federated pointer events as 2D ones, plus the surface point the ray
          hit. A<code>View3D</code> casts a ray from the pointer into the scene and dispatches to
          whatever it strikes.
        </p>
        <h2 id="demo">Demo</h2>
        <p>Move the pointer over a cube, then click it. Drag to orbit the camera.</p>
        <DemoSection title="picking">
          <PickingDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code example</h2>
        <CodeBlock code={demoCode} title="picking.demo.tsx" />
        <h2 id="making-a-node-pickable">Making a node pickable</h2>
        <p>
          <code>eventMode</code> decides whether a node takes part. The default,{" "}
          <code>'passive'</code>, is inert on its own:
        </p>
        <Table>
          <thead>
            <tr>
              <th>
                <code>eventMode</code>
              </th>
              <th>Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>'none'</code>
              </td>
              <td>Ignored entirely</td>
            </tr>
            <tr>
              <td>
                <code>'passive'</code> (default)
              </td>
              <td>
                Not a target, but still picked under an interactive ancestor, which receives the hit
                with this node's surface data
              </td>
            </tr>
            <tr>
              <td>
                <code>'auto'</code>
              </td>
              <td>
                Picked even with no interactive ancestor, finds no target. Costs time; prefer{" "}
                <code>'passive'</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>'static'</code>
              </td>
              <td>
                Picked against its <code>hitVolume</code> and fires its own listeners
              </td>
            </tr>
            <tr>
              <td>
                <code>'dynamic'</code>
              </td>
              <td>
                As <code>'static'</code>, and picked again while the pointer is still, so a node
                that moves under it still gets enter and leave
              </td>
            </tr>
          </tbody>
        </Table>
        <CodeBlock code={`<Mesh3D eventMode="static" onclick={() => select()} />;`} title="tsx" />
        <p>
          One <code>'static'</code> ancestor makes its whole subtree pickable, and the ancestor is
          the target, which is cheaper than marking every mesh.
        </p>
        <h2 id="what-the-pointer-hit">What the pointer hit</h2>
        <p>Two fields carry the 3D information:</p>
        <CodeBlock
          code={`<Mesh3D
  eventMode="static"
  hitVolume="geometry"
  onpointertap={(event) => {
    const hit = event.hit3D;
    if (!hit) return;

    marker.position.copyFrom(hit.point); // where the ray landed, in world space
    console.log(hit.normal.y > 0.9 ? "floor" : "wall");
  }}
/>;`}
          title="tsx"
        />
        <p>
          <code>event.hit3D</code> holds <code>target</code>, <code>point</code>,{" "}
          <code>localPoint</code>, <code>distance</code>, <code>normal</code>, <code>uv</code> and{" "}
          <code>triangleIndex</code>, or <code>null</code> when the ray strikes nothing.{" "}
          <code>event.target3D</code> names the 3D node the event is about, and is
          <code>null</code> when it belongs to the view, such as a click on empty space.
        </p>
        <p>
          <code>normal</code>, <code>uv</code> and <code>triangleIndex</code> need a per-triangle
          hit volume:
        </p>
        <Table>
          <thead>
            <tr>
              <th>
                <code>hitVolume</code>
              </th>
              <th>Picked as</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>default</td>
              <td>The geometry's bounding box. Fast, no surface data</td>
            </tr>
            <tr>
              <td>
                <code>'geometry'</code>
              </td>
              <td>
                Every triangle, so hits carry <code>normal</code>, <code>uv</code> and{" "}
                <code>triangleIndex</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>'box'</code>
              </td>
              <td>A box sized from the node's width, height and depth</td>
            </tr>
            <tr>
              <td>
                <code>Box</code>, <code>Sphere</code>, <code>Geometry3D</code>
              </td>
              <td>That shape</td>
            </tr>
            <tr>
              <td>
                <code>null</code>
              </td>
              <td>Not pickable</td>
            </tr>
          </tbody>
        </Table>
        <p>
          A plain{" "}
          <code>
            {"<"}Container3D{">"}
          </code>{" "}
          has no shape of its own, so it only hears events through its children.
        </p>
        <Aside tone="warning">
          Pixi reuses event objects. Read <code>event.hit3D</code> inside the handler, and copy
          anything you keep —<code>lastHit.copyFrom(event.hit3D.point)</code> — or the next event
          overwrites it.
        </Aside>
        <h2 id="handler-names">Handler names</h2>
        <p>
          Event props are lowercase, matching <code>pixi-solid</code>: <code>onclick</code>,{" "}
          <code>ontap</code>, <code>onpointertap</code>, <code>onpointerdown</code>,
          <code>onpointerenter</code>, <code>onwheel</code>, <code>oncontextmenu</code>.
          Capture-phase variants add <code>capture</code>, as in
          <code>onpointerdowncapture</code>, and pointer moves that are delivered wherever the
          pointer is use the global names, as in <code>onglobalpointermove</code>. See{" "}
          <a href={href("/events/overview")}>Events</a> for the 2D names; 3D supports the same set
          plus the capture forms.
        </p>
        <p>Each event is available two ways, and both work:</p>
        <CodeBlock
          code={`<Mesh3D onpointerenter={() => grow()} />; // handler prop
mesh.on("pointerenter", () => grow()); // emitter, via a ref`}
          title="tsx"
        />
        <p>
          A handler prop runs before the node's <code>on()</code> listeners in every phase, so an
          ancestor's handler prop runs twice per event: once in the capture pass and again in the
          bubble pass. 2D behaves the same.
        </p>
        <p>
          <code>pointerupoutside</code> and <code>pointerout</code> still report where the pointer
          is through <code>hit3D</code>, so a pressed node can tell when the release landed on a
          drop target.
        </p>
        <h2 id="picking-without-an-event">Picking without an event</h2>
        <p>
          <code>view.raycast()</code> runs the same test and dispatches nothing, which is useful for
          a custom cursor or a tool that highlights whatever is under the pointer:
        </p>
        <CodeBlock
          code={`const view = useView3D();
const hit = view.raycast({ x: 400, y: 300 });`}
          title="tsx"
        />
        <h2 id="turning-picking-off">Turning picking off</h2>
        <p>
          The view starts with <code>eventMode</code> <code>'static'</code>, so it catches the
          pointer anywhere in its rectangle. Set the view to <code>'none'</code> or{" "}
          <code>'passive'</code> to switch 3D pointer events off for the whole scene. Picking costs
          time for every node that takes part, so leave <code>'passive'</code> everywhere you do not
          need events.
        </p>
      </Searchable>
    </Article>
  );
}
