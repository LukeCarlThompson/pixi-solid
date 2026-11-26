import type { JSX } from "@solidjs/web";
import { clientOnly } from "@solidjs/web";

import { Aside } from "../../components/molecules/Aside";
import { CodeBlock } from "../../components/molecules/CodeBlock";
import { DemoSection } from "../../components/organisms/DemoSection";
import demoCode from "../../demos/post-processing.demo.tsx?raw";

const PostProcessingDemo = clientOnly(() => import("../../demos/post-processing.demo"), {
  export: "Demo",
});

export const route = {
  info: {
    label: "Post Effects and Passes",
    description:
      "Adding bloom, SSAO, outlines and other post effects to a View3D in pixi-solid-3d.",
    order: 100,
    sections: [
      { id: "adding-passes", title: "Adding passes" },
      { id: "toggling-and-tuning", title: "Toggling and tuning" },
      { id: "available-passes", title: "Available passes" },
      { id: "render-to-texture", title: "Render to texture" },
      { id: "why-there-is-no-bloom-component", title: "Why there is no <Bloom> component" },
    ],
  },
};

export default function Page(): JSX.Element {
  return (
    <article class="ps-prose">
      <h1>Post Effects and Passes</h1>
      <p>
        A pass runs after the 3D scene draws. It can tint the whole image, add bloom, or copy an
        output such as normals into a texture you keep. Passes belong to the <strong>view</strong>,
        not to a node, because they change everything the view draws.
      </p>
      <p>Bloom and an outline pass on emissive materials. Drag to orbit:</p>
      <DemoSection title="post-processing">
        <PostProcessingDemo fallback={<span />} />
      </DemoSection>
      <CodeBlock code={demoCode} title="post-processing.demo.tsx" />
      <h2 id="adding-passes">Adding passes</h2>
      <p>
        Build the pass with <code>@pixi/3d</code> and hand it to the view through{" "}
        <code>passes</code>. The order of the array is the order they run in.
      </p>
      <CodeBlock
        code={`import { BloomEffect, OutlinePass, SsaoEffect } from "@pixi/3d/extras";
import { Mesh3D } from "pixi-solid-3d";
import { View3D } from "pixi-solid-3d";

const bloom = new BloomEffect({ intensity: 1.2, threshold: 0.8 });
const ssao = new SsaoEffect({ radius: 0.5 });
const outline = new OutlinePass({ width: 0.05, color: 0xffffff });

export const Scene = () => (
  <View3D width={800} height={600} passes={[bloom, ssao, outline]}>
    <Mesh3D geometry={geometry} material={material} />
  </View3D>
);`}
        title="tsx"
      />
      <p>
        With{" "}
        <code>
          {"<"}View3DProvider{">"}
        </code>{" "}
        the view owns the passes, so they go on the provider with the other viewport options:
      </p>
      <CodeBlock
        code={`<View3DProvider width={800} height={600} passes={[bloom]}>
  <View3D>{/* 3D scene */}</View3D>
  <HealthBar />
</View3DProvider>;`}
        title="tsx"
      />
      <p>
        Construct passes once, outside the component if nothing reactive feeds them. The array is
        copied when you assign it, so a new array literal each render re-initialises the graph.
      </p>
      <h2 id="toggling-and-tuning">Toggling and tuning</h2>
      <p>
        Turn a pass on and off with <code>enabled</code>. This leaves the render graph alone, so it
        is cheap enough for a settings toggle:
      </p>
      <CodeBlock
        code={`const [glow, setGlow] = createSignal(true);

createEffect(
  () => glow(),
  (enabled) => {
    bloom.enabled = enabled;
  },
);`}
        title="tsx"
      />
      <p>Options that have setters can be driven the same way, from a signal:</p>
      <CodeBlock
        code={`const [strength, setStrength] = createSignal(1);

createEffect(
  () => strength(),
  (value) => {
    bloom.intensity = value;
  },
);`}
        title="tsx"
      />
      <p>
        Do <strong>not</strong> toggle by rebuilding the <code>passes</code> array. Reassigning it
        invalidates the graph, while
        <code>enabled</code> costs nothing.
      </p>
      <p>
        <code>levels</code> and <code>resolution</code> on <code>BloomEffect</code>, and anything
        else the class exposes as read-only, are constructor options. Change those by rebuilding the
        pass.
      </p>
      <h2 id="available-passes">Available passes</h2>
      <table>
        <thead>
          <tr>
            <th>Pass</th>
            <th>Import</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>BloomEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Glow around bright areas</td>
          </tr>
          <tr>
            <td>
              <code>SsaoEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Contact shadowing in creases</td>
          </tr>
          <tr>
            <td>
              <code>MotionBlurEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Directional blur from camera movement</td>
          </tr>
          <tr>
            <td>
              <code>TiltShiftEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Defocus away from a band</td>
          </tr>
          <tr>
            <td>
              <code>TintEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Colour grade the whole image</td>
          </tr>
          <tr>
            <td>
              <code>FxaaEffect</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Cheap anti-aliasing</td>
          </tr>
          <tr>
            <td>
              <code>OutlinePass</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Draw outlines around meshes</td>
          </tr>
          <tr>
            <td>
              <code>WireframePass</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Draw meshes as wireframes</td>
          </tr>
          <tr>
            <td>
              <code>ExtractPass</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Copy a scene output into a texture</td>
          </tr>
          <tr>
            <td>
              <code>PortalPass</code>
            </td>
            <td>
              <code>@pixi/3d/extras</code>
            </td>
            <td>Render a portal through a mirrored camera</td>
          </tr>
        </tbody>
      </table>
      <p>
        For an effect of your own, extend <code>PostEffect</code> (or <code>Pass3D</code>) from{" "}
        <code>@pixi/3d</code> and add the instance to
        <code>passes</code>.
      </p>
      <h2 id="render-to-texture">Render to texture</h2>
      <p>
        <code>ExtractPass</code> copies a scene output — colour, normals or velocity — into a
        texture your app keeps. Use it when the result has to leave the view, for example to show it
        on a 2D sprite, or to feed a compositor of your own.
      </p>
      <CodeBlock
        code={`import { ExtractPass, normalOutput } from "@pixi/3d/extras";
import { Mesh3D, View3D } from "pixi-solid-3d";
import { onCleanup } from "solid-js";

const normals = new ExtractPass({ output: normalOutput });

// This pass owns its texture. Unlike the effects above, it has to be destroyed.
onCleanup(() => normals.destroy());

<View3D width={800} height={600} passes={[normals]}>
  <Mesh3D geometry={geometry} material={material} />
</View3D>;

// \`normals.texture\` is a regular pixi texture, usable on any 2D sprite.`}
        title="tsx"
      />
      <p>
        An effect that reads an output within the same frame, such as an upscaler, should read it in
        its own pass rather than through <code>ExtractPass</code>, so it is not copied out first.
      </p>
      <Aside tone="note">
        <code>Pass3D.destroy()</code> does nothing on the effects listed above: they build their
        render targets into the view's graph, and the view frees them. Only <code>ExtractPass</code>{" "}
        and <code>PortalPass</code> own resources and need <code>destroy()</code> when you unmount.
      </Aside>
      <h2 id="why-there-is-no-bloom-component">
        Why there is no{" "}
        <code>
          {"<"}Bloom{">"}
        </code>{" "}
        component
      </h2>
      <p>Every other 3D node has a component, so the absence here is deliberate.</p>
      <ul>
        <li>
          <p>
            <strong>A pass is view-wide.</strong> A component that registered itself from wherever
            it was mounted could change the rendering of content it knows nothing about. Passes are
            therefore declared only where the view is declared: the <code>passes</code> prop.
          </p>
        </li>
        <li>
          <p>
            <strong>
              <code>passes</code> is already declarative.
            </strong>{" "}
            Order is the array order, and the set of passes is a plain list you can read.
          </p>
        </li>
        <li>
          <p>
            <strong>A component per effect would add nothing.</strong> It would shadow upstream
            class names, repeat their option types, and drift every time <code>@pixi/3d</code> adds
            a pass. Effects are constructed once and tuned through setters, which JSX props do not
            improve on.
          </p>
        </li>
        <li>
          <p>
            <strong>Reactivity has a better answer.</strong> <code>enabled</code> toggles a pass
            without touching the graph, whereas a JSX{" "}
            <code>
              {"<"}Show{">"}
            </code>{" "}
            would reassign <code>passes</code> and rebuild it.
          </p>
        </li>
      </ul>
      <p>
        If JSX ordering is ever worth having, it can be added as one thin component —{" "}
        <code>
          {"<"}View3DPass pass={"{"}bloom{"}"} /{">"}
        </code>
        — that registers into the enclosing view and does nothing else. That would sit beside{" "}
        <code>passes</code>, not replace it.
      </p>
    </article>
  );
}
