const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/perspective-mesh.demo-Bolge0y4.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/object-fit-B53WMoQZ.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { PerspectiveMesh, PixiCanvas, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/ground.webp";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  return (
    <Loading>
      <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode={"contain"}>
        <PerspectiveMesh
          label="Ground"
          texture={texture()}
          verticesX={20}
          verticesY={20}
          x0={50}
          y0={20}
          x1={150}
          y1={20}
          x2={200}
          y2={60}
          x3={0}
          y3={60}
        />
      </ObjectFitContainer>
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Perspective Mesh`),f=t(`<p>A SolidJS component that renders a PixiJS <code>PerspectiveMesh</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.PerspectiveMesh.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./perspective-mesh.demo-Bolge0y4.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])),{export:`Demo`},`src/demos/perspective-mesh.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`perspective-mesh`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`perspective-mesh-demo.tsx`})]}})}})}export{v as default};