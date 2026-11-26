import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Article, Aside, CodeBlock, DemoSection, Searchable, Table } from "../../components";
import demoCode from "../../demos/world-to-screen.demo.tsx?raw";

const WorldToScreenDemo = clientOnly(() => import("../../demos/world-to-screen.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "useWorldToScreen",
    description:
      "Reactively project 3D world coordinates to 2D screen coordinates for overlays and UI.",
    order: 100,
    sections: [
      { id: "interactive-demo", title: "Interactive Demo" },
      { id: "code-example", title: "Code Example" },
      { id: "usage-with-view3dprovider", title: "Usage with View3DProvider" },
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
        <h1>useWorldToScreen</h1>
        <p>
          <code>useWorldToScreen</code> is a reactive SolidJS hook that takes a 3D object or
          coordinate and returns a reactive 2D screen position{" "}
          <code>
            {"{"} x, y, visible {"}"}
          </code>{" "}
          synchronized to the contextual Pixi ticker.
        </p>
        <p>
          This makes attaching 2D HUD elements (health bars, name tags, targeting reticles,
          indicators) over 3D scene objects effortless and fully declarative.
        </p>
        <h2 id="interactive-demo">Interactive Demo</h2>
        <p>
          Notice how the 2D label tag stays locked above the rotating and oscillating 3D cube, even
          as you rotate and zoom the scene with{" "}
          <code>
            {"<"}OrbitCamera{">"}
          </code>
          :
        </p>
        <DemoSection title="world-to-screen">
          <WorldToScreenDemo fallback={<span />} />
        </DemoSection>
        <h2 id="code-example">Code Example</h2>
        <CodeBlock code={demoCode} title="world-to-screen.demo.tsx" />
        <h2 id="usage-with-view3dprovider">Usage with View3DProvider</h2>
        <p>
          When rendering 2D overlays alongside a{" "}
          <code>
            {"<"}View3D{">"}
          </code>{" "}
          viewport, wrap both the 3D viewport and your 2D HUD components in a{" "}
          <code>
            {"<"}View3DProvider{">"}
          </code>
          .
        </p>
        <p>
          The provider <strong>creates and owns</strong> the <code>View3D</code>; the{" "}
          <code>
            {"<"}View3D{">"}
          </code>{" "}
          beneath it just mounts that instance into the 2D scene graph. Viewport configuration
          therefore belongs on the provider, not on{" "}
          <code>
            {"<"}View3D{">"}
          </code>
          .
        </p>
        <CodeBlock
          code={`import { useWorldToScreen, View3D, View3DProvider, Mesh3D } from "pixi-solid-3d";
import { createSignal, Show } from "solid-js";
import { Container, onTick, Text } from "pixi-solid";

// The character's transform is the source of truth — the 3D node and the HUD both render it.
const [position, setPosition] = createSignal({ x: 0, y: 0, z: 0 });

let elapsed = 0;
onTick((ticker) => {
  elapsed += 0.02 * ticker.deltaTime;
  setPosition({ x: Math.sin(elapsed) * 2, y: 0, z: 0 });
});

export const GameScene = () => (
  <View3DProvider width={800} height={600} toneMapping="aces">
    {/* Mounts the provider-owned View3D */}
    <View3D>
      <Mesh3D x={position().x} y={position().y} z={position().z} ... />
    </View3D>

    {/* Sibling 2D Overlay HUD */}
    <PlayerHUD />
  </View3DProvider>
);

const PlayerHUD = () => {
  // Resolves the View3D from the parent <View3DProvider>, and the position from the same signal.
  // No refs, no imperative reads.
  const screenPos = useWorldToScreen(position);

  return (
    <Show when={screenPos().visible}>
      <Container x={screenPos().x} y={screenPos().y - 40}>
        <Text text="Player Name" />
      </Container>
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
                <code>target</code>
              </td>
              <td>
                <code>
                  Container3D | PointData3D | Accessor{"<"}...{">"}
                </code>
              </td>
              <td>The 3D container or coordinate to project</td>
            </tr>
          </tbody>
        </Table>
        <h2 id="context-requirement">Context requirement</h2>
        <p>
          <code>useWorldToScreen</code> reads the ambient <code>View3DContext</code>. Call it inside{" "}
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
              useWorldToScreen must be used within a {"<"}View3D{">"}, a {"<"}View3DProvider{">"},
              or a component mounted inside one.
            </code>
          </p>
        </Aside>
        <p>
          <code>
            {"<"}View3DProvider{">"}
          </code>{" "}
          creates the <code>View3D</code> up front, so the hook always has an instance to project
          through. The projected value becomes meaningful once the scene is built and the camera is
          in the graph, which happens during the first tick after mount.
        </p>
        <h2 id="return-value">Return Value</h2>
        <p>Returns an Accessor to an object with:</p>
        <ul>
          <li>
            <p>
              <code>x: number</code> — 2D screen horizontal coordinate.
            </p>
          </li>
          <li>
            <p>
              <code>y: number</code> — 2D screen vertical coordinate.
            </p>
          </li>
          <li>
            <p>
              <code>visible: boolean</code> — <code>false</code> if the 3D position is behind the
              camera frustum, <code>true</code> when in front.
            </p>
          </li>
        </ul>
      </Searchable>
    </Article>
  );
}
