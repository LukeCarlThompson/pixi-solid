const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/mesh-rope.demo-DfkE_OOx.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/object-fit-B53WMoQZ.js","assets/eel-C4wBzGfg.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { MeshRope, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, Point } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/eel.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [mesh, setMesh] = createSignal<Pixi.MeshRope>();

  // Create the points we will use for our mesh
  const points: Point[] = [];
  for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 50, 0));
  }

  // Fit the mesh whenever it mounts and whenever the screen changes size.
  createEffect(
    () => [mesh(), pixiScreen.width, pixiScreen.height] as const,
    ([instance, width, height]) => {
      if (!instance) return;
      objectFit(instance, { width, height }, "contain");
    },
  );

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    cumulativeDeltaTime += ticker.deltaTime;

    // Update mesh points to create wave motion
    for (let i = 0; i < points.length; i++) {
      points[i].y = Math.sin(cumulativeDeltaTime * 0.1 + i) * 20;
      points[i].x = i * 50 + Math.cos(cumulativeDeltaTime * 0.1 + 1) * 10;
    }
  });

  return (
    <Loading>
      <MeshRope texture={texture()} points={points} ref={setMesh} />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Mesh Rope`),f=t(`<p>A SolidJS component that renders a PixiJS <code>MeshRope</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.MeshRope.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./mesh-rope.demo-DfkE_OOx.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])),{export:`Demo`},`src/demos/mesh-rope.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`mesh-rope`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`tsx`})]}})}})}export{v as default};