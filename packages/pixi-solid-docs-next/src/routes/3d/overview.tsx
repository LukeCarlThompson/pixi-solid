import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { CodeBlock, DemoSection } from "../../components";
import demoCode from "../../demos/view-3d.demo.tsx?raw";
import { href } from "../../href";

const View3dDemo = clientOnly(() => import("../../demos/view-3d.demo"), { export: "Demo" });

export const route = {
  info: {
    label: "3D Overview (Beta)",
    description: "Getting started with 3D in pixi-solid using @pixi/3d.",
    order: 1,
    sections: [
      { id: "installation", title: "Installation" },
      { id: "how-3d-works-in-pixijs", title: "How 3D works in PixiJS" },
      { id: "interactive-demo", title: "Interactive Demo" },
      { id: "code-example", title: "Code Example" },
      { id: "viewport-ownership", title: "Viewport ownership" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>3D Overview (Beta)</h1>
      <p>
        <code>pixi-solid-3d</code> extends <code>pixi-solid</code> with declarative SolidJS
        components for PixiJS 3D scenes powered by <code>@pixi/3d</code>.
      </p>
      <h2 id="installation">Installation</h2>
      <p>Add the 3D package and the 3D engine to your project:</p>
      <CodeBlock code={`pnpm add pixi-solid-3d @pixi/3d`} title="bash" />
      <p>
        <code>@pixi/3d</code> 0.1.0 needs <code>pixi.js</code> 8.23.0 or later.{" "}
        <code>pixi-solid-3d</code> declares{" "}
        <code>
          @pixi/3d {">"}=0.1.0 {"<"}0.2
        </code>
        as a peer, so both packages must be upgraded together.
      </p>
      <p>
        <code>pixi-solid-3d</code> is pre-1.0: the API may change between minor releases. Breaking
        changes ship as <code>0.x</code>
        bumps, which is what semver allows below 1.0.
      </p>
      <p>
        These steps assume <code>solid-js</code>, <code>pixi.js</code>, and <code>pixi-solid</code>{" "}
        are already installed. See
        <a href={href("/getting-started/project-setup")}>Project setup</a> if they are not.
      </p>
      <h2 id="how-3d-works-in-pixijs">How 3D works in PixiJS</h2>
      <p>
        In PixiJS v8, 3D scenes are hosted inside a 2D viewport container called <code>View3D</code>
        .
      </p>
      <ul>
        <li>
          <p>
            <code>
              {"<"}View3D{">"}
            </code>{" "}
            is a 2D PixiJS display node that you can place inside{" "}
            <code>
              {"<"}PixiCanvas{">"}
            </code>{" "}
            or anywhere in your 2D scene graph.
          </p>
        </li>
        <li>
          <p>
            Children placed inside{" "}
            <code>
              {"<"}View3D{">"}
            </code>{" "}
            are automatically attached to its 3D root (<code>view.root</code>, a{" "}
            <code>Container3D</code>).
          </p>
        </li>
        <li>
          <p>
            Inside the 3D scene, you can place 3D containers (
            <code>
              {"<"}Container3D{">"}
            </code>
            ), meshes (
            <code>
              {"<"}Mesh3D{">"}
            </code>
            ), models (
            <code>
              {"<"}Model3D{">"}
            </code>
            ), lights (
            <code>
              {"<"}DirectionalLight{">"}
            </code>
            ,{" "}
            <code>
              {"<"}PointLight{">"}
            </code>
            ,{" "}
            <code>
              {"<"}AmbientLight{">"}
            </code>
            ), and interactive camera controls (
            <code>
              {"<"}OrbitCamera{">"}
            </code>
            ).
          </p>
        </li>
      </ul>
      <h2 id="interactive-demo">Interactive Demo</h2>
      <DemoSection title="view-3d">
        <View3dDemo fallback={<span />} />
      </DemoSection>
      <h2 id="code-example">Code Example</h2>
      <CodeBlock code={demoCode} title="demo-3d.tsx" />
      <h2 id="viewport-ownership">Viewport ownership</h2>
      <p>
        A <code>View3D</code> can only be a 2D display node, so it cannot also contain 2D siblings.
        To render 2D HUD or UI elements on top of the 3D scene, those elements must be mounted{" "}
        <em>beside</em> the viewport and share its <code>View3D</code> instance.{" "}
        <code>
          {"<"}View3DProvider{">"}
        </code>{" "}
        does exactly that: it <strong>creates and owns</strong> the
        <code>View3D</code> and shares it through context, and a{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        beneath it mounts that instance into the 2D scene graph.
      </p>
      <CodeBlock
        code={`<View3DProvider width={800} height={600} toneMapping="aces">
  {/* Mounts the provider-owned View3D and holds the 3D scene */}
  <View3D>
    <Camera3D z={6} />
    <Mesh3D geometry={geometry} material={material} />
  </View3D>

  {/* 2D sibling — resolves the same View3D from context */}
  <HealthBar />
</View3DProvider>;`}
        title="tsx"
      />
      <p>
        Both{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        and{" "}
        <code>
          {"<"}View3DProvider{">"}
        </code>{" "}
        resolve their instance the same way:
      </p>
      <table>
        <thead>
          <tr>
            <th>Case</th>
            <th>
              Who creates the <code>View3D</code>
            </th>
            <th>Who destroys it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>
                {"<"}View3D{">"}
              </code>{" "}
              on its own
            </td>
            <td>
              <code>
                {"<"}View3D{">"}
              </code>
            </td>
            <td>
              <code>
                {"<"}View3D{">"}
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>
                {"<"}View3DProvider{">"}
              </code>{" "}
              on its own
            </td>
            <td>
              <code>
                {"<"}View3DProvider{">"}
              </code>
            </td>
            <td>
              <code>
                {"<"}View3DProvider{">"}
              </code>
            </td>
          </tr>
          <tr>
            <td>
              <code>
                {"<"}View3DProvider as={"{"}view{"}"}
                {">"}
              </code>
            </td>
            <td>you</td>
            <td>nothing</td>
          </tr>
          <tr>
            <td>
              <code>
                {"<"}View3D as={"{"}view{"}"}
                {">"}
              </code>
            </td>
            <td>you</td>
            <td>nothing</td>
          </tr>
          <tr>
            <td>
              <code>
                {"<"}View3D{">"}
              </code>{" "}
              inside{" "}
              <code>
                {"<"}View3DProvider{">"}
              </code>
            </td>
            <td>the provider</td>
            <td>the provider</td>
          </tr>
        </tbody>
      </table>
      <p>
        Because the provider owns the instance, every <code>View3DOptions</code> prop belongs on the
        provider rather than on the{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        that mounts it. In development, passing options to a{" "}
        <code>
          {"<"}View3D{">"}
        </code>{" "}
        inside a
        <code>
          {"<"}View3DProvider{">"}
        </code>{" "}
        logs a warning telling you to move them up. Use <code>as</code> on the <em>provider</em> to
        adopt a <code>View3D</code> you created yourself; combining <code>as</code> with a provider
        throws. For multiple viewports (split-screen, minimap PIP), use one provider per viewport.
      </p>
    </article>
  );
}
