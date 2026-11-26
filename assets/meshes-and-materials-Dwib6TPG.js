const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/meshes-and-materials.demo-DE0nm1Ij.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/resources-DPHE43kQ.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,r as c,t as l}from"./components-BiYutFnA.js";var u=`import { Mesh3D, CubeGeometry, Material3D } from "pixi-solid-3d";
import { createSignal } from "solid-js";

export const InteractiveCube = () => {
  const [roughness, setRoughness] = createSignal(0.2);
  const [color, setColor] = createSignal("#38bdf8");

  return (
    <Mesh3D x={0} y={1} z={0} castShadow={true} receiveShadow={true}>
      <CubeGeometry width={1.5} height={1.5} depth={1.5} />
      <Material3D baseColor={color()} roughness={roughness()} metallic={0.1} />
    </Mesh3D>
  );
};
`,d=`import { SphereGeometry, Material3D } from "@pixi/3d";
import { Mesh3D } from "pixi-solid-3d";
import { For } from "solid-js";

// Instantiated once at module level (shared GPU memory across all instances)
const SHARED_SPHERE = new SphereGeometry({ radius: 0.5 });
const ENEMY_MATERIAL = new Material3D({ baseColor: "#ef4444", roughness: 0.3 });

export const EnemySwarm = (props: {
  enemies: Array<{ id: string; x: number; y: number; z: number }>;
}) => {
  return (
    <For each={props.enemies}>
      {(enemy) => (
        // When an individual enemy unmounts, SHARED_SPHERE and ENEMY_MATERIAL remain alive!
        <Mesh3D
          x={enemy.x}
          y={enemy.y}
          z={enemy.z}
          geometry={SHARED_SPHERE}
          material={ENEMY_MATERIAL}
        />
      )}
    </For>
  );
};
`,f=`import type * as Pixi3D from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  ConeGeometry,
  Container3D,
  CubeGeometry,
  DirectionalLight,
  FlatMaterial,
  Material3D,
  Mesh3D,
  OrbitCamera,
  PhongMaterial,
  SphereGeometry,
  ToonMaterial,
  TorusKnotGeometry,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let group: Pixi3D.Container3D | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (group) group.rotation.y = elapsed * 0.45;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="medium"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={3} z={9} lookAt={{ x: 0, y: 0.6, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={5}
        maxDistance={20}
        target={{ x: 0, y: 0.6, z: 0 }}
      />

      <AmbientLight intensity={0.3} />
      <DirectionalLight
        intensity={2.4}
        x={4}
        y={7}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      <Container3D ref={(container) => (group = container)}>
        {/* Metallic-roughness PBR: the default for real-looking surfaces. */}
        <Mesh3D x={-3.3} castShadow={true}>
          <SphereGeometry radius={0.9} />
          <Material3D baseColor={0x38bdf8} roughness={0.2} metallic={0.6} />
        </Mesh3D>

        {/* Phong: cheap specular highlights, familiar from older engines. */}
        <Mesh3D x={-1.1} castShadow={true}>
          <CubeGeometry width={1.4} height={1.4} depth={1.4} />
          <PhongMaterial baseColor={0x22c55e} shininess={60} />
        </Mesh3D>

        {/* Toon: banded shading with an outline, for stylised work. */}
        <Mesh3D x={1.1} castShadow={true}>
          <ConeGeometry radius={0.85} height={1.7} />
          <ToonMaterial baseColor={0xf97316} bands={4} outline={true} />
        </Mesh3D>

        {/* Flat: unlit, so it ignores every light in the scene. */}
        <Mesh3D x={3.3} castShadow={true}>
          <TorusKnotGeometry radius={0.6} tube={0.22} />
          <FlatMaterial baseColor={0xa855f7} />
        </Mesh3D>
      </Container3D>
    </View3D>
  );
};
`,p=t(`<h1>Meshes and Materials`),m=t(`<p><code>pixi-solid-3d</code> provides <code>&lt;Mesh3D></code> to render 3D geometry combined with materials.`),h=t(`<p>Four geometries and all four material types, on a turntable:`),g=t(`<p>In 3D rendering engines like PixiJS 3D, GPU resources (buffers, textures, and shader pipeline descriptors) are expensive to allocate. <code>pixi-solid-3d</code> gives you two ways to work with geometries and materials:`),_=t(`<ol><li><p><strong>Declarative Nested Components</strong> <em>(Recommended for component-scoped resources)</em>: Material options stay live, and the resource is <strong>disposed automatically</strong> on unmount.</p></li><li><p><strong>Instantiated Object Props</strong> <em>(Recommended for shared / global resources)</em>: Pass pre-created class instances where <strong>you retain ownership</strong> and manage lifecycle.`),v=t(`<hr>`),y=t(`<h2 id=1-declarative-nested-components-automatic-disposal>1. Declarative Nested Components (Automatic Disposal)`),b=t(`<p>When geometries and materials are placed as direct JSX children of <code>&lt;Mesh3D></code>, <code>pixi-solid-3d</code> manages their lifecycle for you. When the component unmounts or conditionally swaps, it calls <code>.destroy()</code> automatically.`),x=t(`<p>Furthermore, updating properties like <code>roughness</code>, <code>metallic</code>, or <code>baseColor</code> updates the existing GPU material directly with zero allocations.`),S=t(`<h2 id=changing-size-and-changing-shape>Changing size, and changing shape`),C=t(`<p>A geometry's options are read when it is built — <code>@pixi/3d</code> turns them into vertex buffers and keeps no settable copy — so changing a geometry option after mount does not reshape it. Materials are the opposite: their options are live fields, so <code>&lt;Material3D roughness={roughness()} /></code> follows the signal.`),w=t(`<p>To make something bigger, <strong>scale the mesh</strong>. That is a transform, so it costs nothing and updates every frame:`),T=t(`<p>To change the shape itself — segments, radius, a different geometry altogether — mount a new geometry. Inside <code>&lt;Mesh3D></code>, <code>&lt;Show keyed></code> remounts it and disposes the old one:`),E=t(`<p>Scaling is not always equivalent: anything that reads vertex positions, such as the dissolve bit's holes, works in the geometry's stored units and therefore scales with the mesh. Those need a rebuilt geometry, which is why the two are separate operations.`),D=t(`<h3 id=conditional-swapping-with-or>Conditional Swapping with <code>&lt;Show></code> or <code>&lt;Switch>`),O=t(`<p>You can conditionally swap materials or geometries using standard SolidJS primitives. When the condition flips, the old material is automatically destroyed, and the new one takes its place:`),k=t(`<h2 id=2-instantiated-object-props-resource-sharing>2. Instantiated Object Props (Resource Sharing)`),A=t(`<p>If you have a geometry or material that is <strong>shared across hundreds of meshes</strong> (e.g., enemy particles, terrain tiles, or trees in a forest), you should create a single instance outside the component tree and pass it as a prop.`),j=t(`<p>When passed as a prop, <code>pixi-solid-3d</code> treats it as <strong>user-owned</strong> and will <strong>never</strong> destroy it when an individual mesh unmounts:`),M=t(`<h2 id=summary-of-lifecycles>Summary of Lifecycles`),N=t(`<thead><tr><th>Usage Pattern</th><th>Syntax</th><th>Who Owns Cleanup?</th><th>When is it Destroyed?`),P=t(`<tbody><tr><td><strong>Nested JSX Child</strong></td><td><code>&lt;Mesh3D>&lt;CubeGeometry />&lt;Material3D />&lt;/Mesh3D></code></td><td><code>pixi-solid-3d</code></td><td>Automatically on unmount / condition change</td></tr><tr><td><strong>Direct Prop</strong></td><td><code>&lt;Mesh3D geometry={geom} material={mat} /></code></td><td>Caller / Application</td><td>When caller manually calls <code>geom.destroy()`),F=t(`<h2 id=available-declarative-geometries>Available Declarative Geometries`),I=t(`<ul><li><p><code>&lt;CubeGeometry width={...} height={...} depth={...} /></code></p></li><li><p><code>&lt;SphereGeometry radius={...} widthSegments={...} heightSegments={...} /></code></p></li><li><p><code>&lt;PlaneGeometry width={...} height={...} /></code> — lies in XY with a +Z normal, so a quarter turn on X makes it a floor</p></li><li><p><code>&lt;CylinderGeometry radiusTop={...} radiusBottom={...} height={...} /></code></p></li><li><p><code>&lt;ConeGeometry radius={...} height={...} /></code></p></li><li><p><code>&lt;CapsuleGeometry radius={...} height={...} /></code></p></li><li><p><code>&lt;TorusGeometry radius={...} tube={...} /></code></p></li><li><p><code>&lt;TorusKnotGeometry radius={...} tube={...} /></code></p></li><li><p><code>&lt;IcosahedronGeometry radius={...} />`),L=t(`<h2 id=available-declarative-materials>Available Declarative Materials`),R=t(`<ul><li><p><code>&lt;Material3D baseColor={...} roughness={...} metallic={...} normalTexture={...} /></code> — PBR metallic-roughness material.</p></li><li><p><code>&lt;FlatMaterial baseColor={...} baseColorTexture={...} /></code> — Unlit flat color or texture.</p></li><li><p><code>&lt;PhongMaterial baseColor={...} specularColor={...} shininess={...} /></code> — Classic Blinn-Phong material.</p></li><li><p><code>&lt;ToonMaterial baseColor={...} bands={...} outline={...} /></code> — Cel-shaded stylized toon material.`),z=t(`<span>`),B=n(()=>i(()=>import(`./meshes-and-materials.demo-DE0nm1Ij.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),{export:`Demo`},`src/demos/meshes-and-materials.demo.tsx`);function V(){return e(a,{get children(){return e(o,{get children(){return[r(p),r(m),r(h),e(l,{title:`meshes-and-materials`,get children(){return e(B,{get fallback(){return r(z)}})}}),e(s,{code:f,title:`meshes-and-materials.demo.tsx`}),r(g),r(_),r(v),r(y),r(b),r(x),e(s,{code:u,title:`tsx`}),r(S),r(C),r(w),e(s,{code:`<Mesh3D scaleX={width()} origin={{ x: 0.5, y: 0.5, z: 0.5 }}>
  <CubeGeometry width={1} height={1} depth={1} />
  <Material3D baseColor="#38bdf8" />
</Mesh3D>;`,title:`tsx`}),r(T),e(s,{code:`<Show keyed when={detail()}>
  {(detail) => <SphereGeometry radius={1} widthSegments={detail} heightSegments={detail} />}
</Show>;`,title:`tsx`}),r(E),r(D),r(O),e(s,{code:`<Mesh3D>
  <CubeGeometry width={2} />
  <Show when={isHovered()} fallback={<Material3D baseColor="#38bdf8" roughness={0.5} />}>
    <Material3D baseColor="#ff4f4c" roughness={0.1} />
  </Show>
</Mesh3D>;`,title:`tsx`}),r(v),r(k),r(A),r(j),e(s,{code:d,title:`tsx`}),r(v),r(M),e(c,{get children(){return[r(N),r(P)]}}),r(v),r(F),r(I),r(L),r(R)]}})}})}export{V as default};