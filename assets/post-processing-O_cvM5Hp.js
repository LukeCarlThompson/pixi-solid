const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/post-processing.demo-Bkw-lpQa.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/instanceFetchBitGl-ImlogTEr.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,r as c,s as l,t as u}from"./components-BiYutFnA.js";var d=`import { BloomEffect, OutlinePass } from "@pixi/3d/extras";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  SphereGeometry,
  View3D,
} from "pixi-solid-3d";

// Passes are built once and handed to the view. Toggle them with \`enabled\`, never by
// rebuilding the array, which would rebuild the render graph.
const bloom = new BloomEffect({ intensity: 1.6, threshold: 0.35, radius: 0.7 });
const outline = new OutlinePass({ width: 0.02, color: 0x0ea5e9 });

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#05070d" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let elapsed = 0;
  let ring: { position: { x: number; z: number } } | undefined;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (ring) {
      ring.position.x = Math.cos(elapsed * 0.7) * 2.4;
      ring.position.z = Math.sin(elapsed * 0.7) * 2.4;
    }
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      passes={[outline, bloom]}
      environment={{ skyColor: "#0b1220", groundColor: "#020409", intensity: 0.3 }}
    >
      <Camera3D x={0} y={2.5} z={8} lookAt={{ x: 0, y: 0.4, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={5} maxDistance={18} />

      <AmbientLight intensity={0.2} />
      <DirectionalLight intensity={1.6} x={3} y={6} z={4} lookAt={{ x: 0, y: 0, z: 0 }} />

      {/* Emissive above 1 goes past white, which is what bloom picks up. */}
      <Mesh3D x={-1.8} y={0.5}>
        <SphereGeometry radius={0.8} />
        <Material3D baseColor={0x111827} emissive={{ color: 0x38bdf8, strength: 3 }} />
      </Mesh3D>

      <Mesh3D x={1.8} y={0.5}>
        <CubeGeometry width={1.2} height={1.2} depth={1.2} />
        <Material3D baseColor={0x111827} emissive={{ color: 0xf97316, strength: 2.6 }} />
      </Mesh3D>

      <Mesh3D ref={(mesh) => (ring = mesh)} y={0.4}>
        <SphereGeometry radius={0.35} />
        <Material3D baseColor={0x111827} emissive={{ color: 0xf472b6, strength: 4 }} />
      </Mesh3D>
    </View3D>
  );
};
`,f=t(`<h1>Post Effects and Passes`),p=t(`<p>A pass runs after the 3D scene draws. It can tint the whole image, add bloom, or copy an output such as normals into a texture you keep. Passes belong to the <strong>view</strong>, not to a node, because they change everything the view draws.`),m=t(`<p>Bloom and an outline pass on emissive materials. Drag to orbit:`),h=t(`<h2 id=adding-passes>Adding passes`),g=t(`<p>Build the pass with <code>@pixi/3d</code> and hand it to the view through <code>passes</code>. The order of the array is the order they run in.`),_=t(`<p>With <code>&lt;View3DProvider></code> the view owns the passes, so they go on the provider with the other viewport options:`),v=t(`<p>Construct passes once, outside the component if nothing reactive feeds them. The array is copied when you assign it, so a new array literal each render re-initialises the graph.`),y=t(`<h2 id=toggling-and-tuning>Toggling and tuning`),b=t(`<p>Turn a pass on and off with <code>enabled</code>. This leaves the render graph alone, so it is cheap enough for a settings toggle:`),x=t(`<p>Options that have setters can be driven the same way, from a signal:`),S=t(`<p>Do <strong>not</strong> toggle by rebuilding the <code>passes</code> array. Reassigning it invalidates the graph, while<code>enabled</code> costs nothing.`),C=t(`<p><code>levels</code> and <code>resolution</code> on <code>BloomEffect</code>, and anything else the class exposes as read-only, are constructor options. Change those by rebuilding the pass.`),w=t(`<h2 id=available-passes>Available passes`),T=t(`<thead><tr><th>Pass</th><th>Import</th><th>What it does`),E=t(`<tbody><tr><td><code>BloomEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Glow around bright areas</td></tr><tr><td><code>SsaoEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Contact shadowing in creases</td></tr><tr><td><code>MotionBlurEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Directional blur from camera movement</td></tr><tr><td><code>TiltShiftEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Defocus away from a band</td></tr><tr><td><code>TintEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Colour grade the whole image</td></tr><tr><td><code>FxaaEffect</code></td><td><code>@pixi/3d/extras</code></td><td>Cheap anti-aliasing</td></tr><tr><td><code>OutlinePass</code></td><td><code>@pixi/3d/extras</code></td><td>Draw outlines around meshes</td></tr><tr><td><code>WireframePass</code></td><td><code>@pixi/3d/extras</code></td><td>Draw meshes as wireframes</td></tr><tr><td><code>ExtractPass</code></td><td><code>@pixi/3d/extras</code></td><td>Copy a scene output into a texture</td></tr><tr><td><code>PortalPass</code></td><td><code>@pixi/3d/extras</code></td><td>Render a portal through a mirrored camera`),D=t(`<p>For an effect of your own, extend <code>PostEffect</code> (or <code>Pass3D</code>) from <code>@pixi/3d</code> and add the instance to<code>passes</code>.`),O=t(`<h2 id=render-to-texture>Render to texture`),k=t(`<p><code>ExtractPass</code> copies a scene output — colour, normals or velocity — into a texture your app keeps. Use it when the result has to leave the view, for example to show it on a 2D sprite, or to feed a compositor of your own.`),A=t(`<p>An effect that reads an output within the same frame, such as an upscaler, should read it in its own pass rather than through <code>ExtractPass</code>, so it is not copied out first.`),j=t(`<code>Pass3D.destroy()`),M=t(`<code>ExtractPass`),N=t(`<code>PortalPass`),P=t(`<code>destroy()`),F=t(`<h2 id=why-there-is-no-bloom-component>Why there is no <code>&lt;Bloom></code> component`),I=t(`<p>Every other 3D node has a component, so the absence here is deliberate.`),L=t(`<ul><li><p><strong>A pass is view-wide.</strong> A component that registered itself from wherever it was mounted could change the rendering of content it knows nothing about. Passes are therefore declared only where the view is declared: the <code>passes</code> prop.</p></li><li><p><strong><code>passes</code> is already declarative.</strong> Order is the array order, and the set of passes is a plain list you can read.</p></li><li><p><strong>A component per effect would add nothing.</strong> It would shadow upstream class names, repeat their option types, and drift every time <code>@pixi/3d</code> adds a pass. Effects are constructed once and tuned through setters, which JSX props do not improve on.</p></li><li><p><strong>Reactivity has a better answer.</strong> <code>enabled</code> toggles a pass without touching the graph, whereas a JSX <code>&lt;Show></code> would reassign <code>passes</code> and rebuild it.`),R=t(`<p>If JSX ordering is ever worth having, it can be added as one thin component — <code>&lt;View3DPass pass={bloom} /></code>— that registers into the enclosing view and does nothing else. That would sit beside <code>passes</code>, not replace it.`),z=t(`<span>`),B=n(()=>i(()=>import(`./post-processing.demo-Bkw-lpQa.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])),{export:`Demo`},`src/demos/post-processing.demo.tsx`);function V(){return e(a,{get children(){return e(o,{get children(){return[r(f),r(p),r(m),e(u,{title:`post-processing`,get children(){return e(B,{get fallback(){return r(z)}})}}),e(s,{code:d,title:`post-processing.demo.tsx`}),r(h),r(g),e(s,{code:`import { BloomEffect, OutlinePass, SsaoEffect } from "@pixi/3d/extras";
import { Mesh3D } from "pixi-solid-3d";
import { View3D } from "pixi-solid-3d";

const bloom = new BloomEffect({ intensity: 1.2, threshold: 0.8 });
const ssao = new SsaoEffect({ radius: 0.5 });
const outline = new OutlinePass({ width: 0.05, color: 0xffffff });

export const Scene = () => (
  <View3D width={800} height={600} passes={[bloom, ssao, outline]}>
    <Mesh3D geometry={geometry} material={material} />
  </View3D>
);`,title:`tsx`}),r(_),e(s,{code:`<View3DProvider width={800} height={600} passes={[bloom]}>
  <View3D>{/* 3D scene */}</View3D>
  <HealthBar />
</View3DProvider>;`,title:`tsx`}),r(v),r(y),r(b),e(s,{code:`const [glow, setGlow] = createSignal(true);

createEffect(
  () => glow(),
  (enabled) => {
    bloom.enabled = enabled;
  },
);`,title:`tsx`}),r(x),e(s,{code:`const [strength, setStrength] = createSignal(1);

createEffect(
  () => strength(),
  (value) => {
    bloom.intensity = value;
  },
);`,title:`tsx`}),r(S),r(C),r(w),e(c,{get children(){return[r(T),r(E)]}}),r(D),r(O),r(k),e(s,{code:`import { ExtractPass, normalOutput } from "@pixi/3d/extras";
import { Mesh3D, View3D } from "pixi-solid-3d";
import { onCleanup } from "solid-js";

const normals = new ExtractPass({ output: normalOutput });

// This pass owns its texture. Unlike the effects above, it has to be destroyed.
onCleanup(() => normals.destroy());

<View3D width={800} height={600} passes={[normals]}>
  <Mesh3D geometry={geometry} material={material} />
</View3D>;

// \`normals.texture\` is a regular pixi texture, usable on any 2D sprite.`,title:`tsx`}),r(A),e(l,{tone:`note`,get children(){return[r(j),` does nothing on the effects listed above: they build their render targets into the view's graph, and the view frees them. Only`,` `,r(M),` and `,r(N),` own resources and need`,` `,r(P),` when you unmount.`]}}),r(F),r(I),r(L),r(R)]}})}})}export{V as default};