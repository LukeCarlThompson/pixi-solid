const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/tiling-sprite.demo--zRCwOUL.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/ground-tile-Cp0xO0Yu.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { onTick, PixiCanvas, TilingSprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/ground-tile.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  let tile: Pixi.TilingSprite | undefined;

  onTick((ticker) => {
    if (tile) tile.tilePosition.x -= 2 * ticker.deltaTime;
  });

  return (
    <Loading>
      <TilingSprite
        ref={(instance) => (tile = instance)}
        width={pixiScreen.width}
        height={pixiScreen.height * 0.5}
        position={{ x: 0, y: pixiScreen.height * 0.5 }}
        texture={texture()}
        tileScale={{ x: 3, y: 3 }}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Tiling Sprite`),f=t(`<p>A SolidJS component that renders a PixiJS <code>TilingSprite</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.TilingSprite.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./tiling-sprite.demo--zRCwOUL.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])),{export:`Demo`},`src/demos/tiling-sprite.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`tiling-sprite`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`tiling-sprite-demo.tsx`})]}})}})}export{v as default};