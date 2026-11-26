const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/mesh-plane.demo-mj_mc1I6.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/object-fit-B53WMoQZ.js","assets/sky-kt9IjSui.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { MeshPlane, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [mesh, setMesh] = createSignal<Pixi.MeshPlane>();

  // Fit the mesh whenever it mounts and whenever the screen changes size.
  createEffect(
    () => [mesh(), pixiScreen.width, pixiScreen.height] as const,
    ([instance, width, height]) => {
      if (!instance) return;
      instance.pivot.y = 10;
      objectFit(instance, { width: width + 100, height: height * 1.2 }, "cover");
    },
  );

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    const instance = mesh();
    if (!instance) return;

    cumulativeDeltaTime += ticker.deltaTime;

    // Get the buffer for vertex positions.
    const { buffer } = instance.geometry.getAttribute("aPosition");

    for (let i = 0; i < buffer.data.length; i++) {
      buffer.data[i] += Math.sin(cumulativeDeltaTime * 0.1 + i) * 0.2;
    }
    buffer.update();
  });

  return (
    <Loading>
      <MeshPlane texture={texture()} verticesX={10} verticesY={10} ref={setMesh} />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Mesh Plane`),f=t(`<p>A SolidJS component that renders a PixiJS <code>MeshPlane</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.MeshPlane.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./mesh-plane.demo-mj_mc1I6.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])),{export:`Demo`},`src/demos/mesh-plane.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`mesh-plane`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`tsx`})]}})}})}export{v as default};