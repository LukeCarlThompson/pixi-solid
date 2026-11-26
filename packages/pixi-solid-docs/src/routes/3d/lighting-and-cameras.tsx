import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import snippet1 from "../../code-examples/3d-lighting-and-cameras-1.tsx?raw";
import snippet2 from "../../code-examples/3d-lighting-and-cameras-2.tsx?raw";
import { Article, CodeBlock, DemoSection, Searchable } from "../../components";
import demoCode from "../../demos/lighting-and-cameras.demo.tsx?raw";

const LightingAndCamerasDemo = clientOnly(() => import("../../demos/lighting-and-cameras.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Lighting and Cameras",
    description: "Setting up 3D lights and camera controllers in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "lights", title: "Lights" },
      { id: "cameras-and-controls", title: "Cameras and Controls" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <Article>
      <Searchable>
        <h1>Lighting and Cameras</h1>
        <p>Four lights and an orbit camera over a shadowed floor. Drag to orbit.</p>
        <DemoSection title="lighting-and-cameras">
          <LightingAndCamerasDemo fallback={<span />} />
        </DemoSection>
        <CodeBlock code={demoCode} title="lighting-and-cameras.demo.tsx" />
        <h2 id="lights">Lights</h2>
        <p>
          <code>pixi-solid-3d</code> exports reactive light components:
        </p>
        <ul>
          <li>
            <p>
              <code>
                {"<"}AmbientLight intensity={"{"}0.5{"}"} color={"{"}0xffffff{"}"} /{">"}
              </code>
            </p>
          </li>
          <li>
            <p>
              <code>
                {"<"}DirectionalLight intensity={"{"}2{"}"} color={"{"}0xffffff{"}"} castShadow=
                {"{"}
                true{"}"} lookAt={"{"}
                {"{"} x: 0, y: 0, z: 0 {"}"}
                {"}"} /{">"}
              </code>
            </p>
          </li>
          <li>
            <p>
              <code>
                {"<"}PointLight intensity={"{"}5{"}"} range={"{"}20{"}"} color={"{"}0xffaa00{"}"} /
                {">"}
              </code>
            </p>
          </li>
          <li>
            <p>
              <code>
                {"<"}SpotLight intensity={"{"}10{"}"} coneAngle={"{"}Math.PI / 4{"}"} penumbra={"{"}
                0.3{"}"} castShadow={"{"}true{"}"} lookAt={"{"}
                {"{"} x: 0, y: 0, z: 0 {"}"}
                {"}"} /{">"}
              </code>
            </p>
          </li>
        </ul>
        <p>
          <code>range</code> and <code>radius</code> bound how far a point or spot light reaches and
          how soft its falloff is. A spot light also takes <code>coneAngle</code> and{" "}
          <code>penumbra</code>.
        </p>
        <p>
          All lights and containers support the reactive <code>lookAt</code> prop as well as
          individual axis props (<code>lookAtX</code>, <code>lookAtY</code>, <code>lookAtZ</code>)
          to orient their forward axis toward a 3D coordinate target with fine-grained reactivity.
        </p>
        <h2 id="cameras-and-controls">Cameras and Controls</h2>
        <p>
          <code>
            {"<"}View3D{">"}
          </code>{" "}
          creates a default <code>Camera3D</code> automatically. You can also customize or position
          it, or add{" "}
          <code>
            {"<"}OrbitCamera{">"}
          </code>{" "}
          or{" "}
          <code>
            {"<"}FPSCamera{">"}
          </code>{" "}
          to enable interactive camera controls:
        </p>
        <CodeBlock code={snippet1} title="tsx" />
        <h3 id="first-person-camera">
          First-Person Camera (
          <code>
            {"<"}FPSCamera{">"}
          </code>
          )
        </h3>
        <p>
          For walkthroughs or first-person gameplay, use{" "}
          <code>
            {"<"}FPSCamera{">"}
          </code>{" "}
          for WASD movement and mouse-look:
        </p>
        <CodeBlock code={snippet2} title="tsx" />
      </Searchable>
    </Article>
  );
}
