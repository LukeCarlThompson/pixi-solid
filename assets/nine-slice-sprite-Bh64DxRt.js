const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/nine-slice-sprite.demo-sWaUB_jT.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { NineSliceSprite, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/nine-slice.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [sprite, setSprite] = createSignal<Pixi.NineSliceSprite>();

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    const instance = sprite();
    if (!instance) return;

    cumulativeDeltaTime += ticker.deltaTime;

    // Change the width and height to show dynamic scaling with stable corner scale
    instance.width =
      (Math.abs(Math.sin(cumulativeDeltaTime * 0.01)) * 0.8 + 0.2) * pixiScreen.width;
    instance.height =
      (Math.abs(Math.sin(cumulativeDeltaTime * 0.003)) * 0.8 + 0.2) * pixiScreen.height;
  });

  return (
    <Loading>
      <NineSliceSprite
        texture={texture()}
        // Add in the boundaries for scaling
        leftWidth={90}
        rightWidth={90}
        topHeight={90}
        bottomHeight={90}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        ref={setSprite}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="pink">
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Nine Slice Sprite`),f=t(`<p>A SolidJS component that renders a PixiJS <code>NineSliceSprite</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.NineSliceSprite.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./nine-slice-sprite.demo-sWaUB_jT.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])),{export:`Demo`},`src/demos/nine-slice-sprite.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`nine-slice-sprite`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`tsx`})]}})}})}export{v as default};