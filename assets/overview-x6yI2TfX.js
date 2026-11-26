const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/view-3d.demo-CSl_2tg3.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/dist-BacaWkv9.js","assets/EventSystem-C-891Yha.js","assets/checkExtension-BGvys2BB.js","assets/Container3D-6nYjydl4.js","assets/CubeGeometry-BthFmsAf.js","assets/orbit-camera-BY0abxTi.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,M as n,a as r,c as i,d as a,ht as o,p as s,z as c}from"./web-BTd9NawZ.js";import{c as l,i as u,o as d,r as f,t as p,u as m}from"./components-BiYutFnA.js";var h=`import type * as Pixi3D from "@pixi/3d";
import { CubeGeometry, Material3D } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  Container3D,
  DirectionalLight,
  Mesh3D,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#111" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  const geometry = new CubeGeometry({ width: 2, height: 2, depth: 2 });
  const material = new Material3D({
    baseColor: 0x4f88ea,
    roughness: 0.3,
    metallic: 0.2,
  });

  let cube: Pixi3D.Container3D | undefined;

  onTick((ticker) => {
    if (!cube) return;

    cube.rotation.y += 0.01 * ticker.deltaTime;
    cube.rotation.x += 0.005 * ticker.deltaTime;
  });

  return (
    <View3D width={pixiScreen.width} height={pixiScreen.height} toneMapping="aces">
      <Camera3D x={0} y={3} z={5} />
      <OrbitCamera enableDamping={true} minDistance={2} maxDistance={20} />
      <AmbientLight intensity={0.4} />
      <DirectionalLight
        intensity={2.5}
        color={0xffffff}
        x={5}
        y={8}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
      />
      <Container3D ref={(container) => (cube = container)}>
        <Mesh3D geometry={geometry} material={material} castShadow={true} receiveShadow={true} />
      </Container3D>
    </View3D>
  );
};
`,g=t(`<h1>3D Overview (Beta)`),_=t(`<p><code>pixi-solid-3d</code> extends <code>pixi-solid</code> with declarative SolidJS components for PixiJS 3D scenes powered by <code>@pixi/3d</code>.`),v=t(`<h2 id=installation>Installation`),y=t(`<p>Add the 3D package and the 3D engine to your project:`),b=t(`<p><code>@pixi/3d</code> 0.1.0 needs <code>pixi.js</code> 8.23.0 or later. <code>pixi-solid-3d</code> declares <code>@pixi/3d >=0.1.0 &lt;0.2</code>as a peer, so both packages must be upgraded together.`),x=t(`<p><code>pixi-solid-3d</code> is pre-1.0: the API may change between minor releases. Breaking changes ship as <code>0.x</code>bumps, which is what semver allows below 1.0.`),S=t(`<p>These steps assume <code>solid-js</code>, <code>pixi.js</code>, and <code>pixi-solid</code> are already installed. See<a>Project setup</a> if they are not.`),C=t(`<h2 id=how-3d-works-in-pixijs>How 3D works in PixiJS`),w=t(`<p>In PixiJS v8, 3D scenes are hosted inside a 2D viewport container called <code>View3D</code>.`),T=t(`<ul><li><p><code>&lt;View3D></code> is a 2D PixiJS display node that you can place inside <code>&lt;PixiCanvas></code> or anywhere in your 2D scene graph.</p></li><li><p>Children placed inside <code>&lt;View3D></code> are automatically attached to its 3D root (<code>view.root</code>, a <code>Container3D</code>).</p></li><li><p>Inside the 3D scene, you can place 3D containers (<code>&lt;Container3D></code>), meshes (<code>&lt;Mesh3D></code>), models (<code>&lt;Model3D></code>), lights (<code>&lt;DirectionalLight></code>, <code>&lt;PointLight></code>, <code>&lt;AmbientLight></code>), and interactive camera controls (<code>&lt;OrbitCamera></code>).`),E=t(`<h2 id=interactive-demo>Interactive Demo`),D=t(`<h2 id=code-example>Code Example`),O=t(`<h2 id=viewport-ownership>Viewport ownership`),k=t(`<p>A <code>View3D</code> can only be a 2D display node, so it cannot also contain 2D siblings. To render 2D HUD or UI elements on top of the 3D scene, those elements must be mounted <em>beside</em> the viewport and share its <code>View3D</code> instance. <code>&lt;View3DProvider></code> does exactly that: it <strong>creates and owns</strong> the<code>View3D</code> and shares it through context, and a <code>&lt;View3D></code> beneath it mounts that instance into the 2D scene graph.`),A=t(`<p>Both <code>&lt;View3D></code> and <code>&lt;View3DProvider></code> resolve their instance the same way:`),j=t(`<thead><tr><th>Case</th><th>Who creates the <code>View3D</code></th><th>Who destroys it`),M=t(`<tbody><tr><td><code>&lt;View3D></code> on its own</td><td><code>&lt;View3D></code></td><td><code>&lt;View3D></code></td></tr><tr><td><code>&lt;View3DProvider></code> on its own</td><td><code>&lt;View3DProvider></code></td><td><code>&lt;View3DProvider></code></td></tr><tr><td><code>&lt;View3DProvider as={view}></code></td><td>you</td><td>nothing</td></tr><tr><td><code>&lt;View3D as={view}></code></td><td>you</td><td>nothing</td></tr><tr><td><code>&lt;View3D></code> inside <code>&lt;View3DProvider></code></td><td>the provider</td><td>the provider`),N=t(`<p>Because the provider owns the instance, every <code>View3DOptions</code> prop belongs on the provider rather than on the <code>&lt;View3D></code> that mounts it. In development, passing options to a <code>&lt;View3D></code> inside a<code>&lt;View3DProvider></code> logs a warning telling you to move them up. Use <code>as</code> on the <em>provider</em> to adopt a <code>View3D</code> you created yourself; combining <code>as</code> with a provider throws. For multiple viewports (split-screen, minimap PIP), use one provider per viewport.`),P=t(`<span>`),F=i(()=>c(()=>import(`./view-3d.demo-CSl_2tg3.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/view-3d.demo.tsx`);function I(){return e(l,{get children(){return e(u,{get children(){return[s(g),s(_),s(v),s(y),e(d,{code:`pnpm add pixi-solid-3d @pixi/3d`,title:`bash`}),s(b),s(x),(()=>{var e=s(S),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling,i=o();return a(()=>m(`/getting-started/project-setup`),e=>{n(t,`href`,e),r(t,i)}),e})(),s(C),s(w),s(T),s(E),e(p,{title:`view-3d`,get children(){return e(F,{get fallback(){return s(P)}})}}),s(D),e(d,{code:h,title:`demo-3d.tsx`}),s(O),s(k),e(d,{code:`<View3DProvider width={800} height={600} toneMapping="aces">
  {/* Mounts the provider-owned View3D and holds the 3D scene */}
  <View3D>
    <Camera3D z={6} />
    <Mesh3D geometry={geometry} material={material} />
  </View3D>

  {/* 2D sibling — resolves the same View3D from context */}
  <HealthBar />
</View3DProvider>;`,title:`tsx`}),s(A),e(f,{get children(){return[s(j),s(M)]}}),s(N)]}})}})}export{I as default};