const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/filters.demo-CFfUrhjG.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/BlurFilter-BMdnZ5a3.js","assets/object-fit-B53WMoQZ.js","assets/bird_03-D1QJhzFY.js","assets/sky-kt9IjSui.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import type { JSX } from "@solidjs/web";
import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, TextureStyle } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading, onCleanup, Show } from "solid-js";

import birdAssetUrl from "@/assets/bird_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Set scale mode for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const assetsReady = createMemo(async () => {
    await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
    ]);
    return true;
  });

  // Create the filter using the Pixi class
  const blurFilter = new BlurFilter({ strength: 0 });

  // Assign a signal and use a createEffect to bind it to the Pixi class.
  const [blurAmount, setBlurAmount] = createSignal(1);
  createEffect(
    () => blurAmount(),
    (amount) => {
      blurFilter.strength = amount;
    },
  );

  // Any time we create Pixi classes directly we need to remember to destroy them when our component is cleaned up.
  onCleanup(() => {
    blurFilter.destroy();
  });

  // Listen to pointer and set the blur amount signal to demonstrate binding PixiJS classes with signals
  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 ||
      e.global.x > pixiScreen.width ||
      e.global.y < 0 ||
      e.global.y > pixiScreen.height;
    if (notInsideCanvas) return;

    const newBlurAmount = Math.min(Math.max((e.global.x / pixiScreen.width) * 10, 0), 10);
    setBlurAmount(newBlurAmount);
  };

  return (
    <Loading>
      <Show when={assetsReady()}>
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
          <Sprite
            label="sky"
            texture={Assets.get<Pixi.Texture>("sky")}
            filters={blurFilter}
            eventMode="static"
            onglobalpointermove={handlePointerMove}
          />
        </ObjectFitContainer>

        <Sprite
          label="bird"
          texture={Assets.get<Pixi.Texture>("bird")}
          scale={2}
          anchor={0.5}
          x={pixiScreen.width * 0.5}
          y={pixiScreen.height * 0.5}
        />
      </Show>
    </Loading>
  );
};

export const Demo = (): JSX.Element => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Filters`),f=t(`<p>To use PixiJS filters, instantiate them from the PixiJS classes, then bind the properties you want to change to signals.`),p=t(`<p>Any PixiJS class you instantiate directly must be destroyed manually when the component is cleaned up. The <code>onCleanup</code> hook handles this:`),m=t(`<p>Please see the <a href=https://pixijs.download/release/docs/filters.html>PixiJS docs</a> for detailed information.`),h=t(`<h2 id=demo>Demo`),g=t(`<p>Move your mouse left to right across the sky to adjust the strength of the blur filter.`),_=t(`<h2 id=code-example>Code example`),v=t(`<span>`),y=r(()=>a(()=>import(`./filters.demo-CFfUrhjG.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),{export:`Demo`},`src/demos/filters.demo.tsx`);function b(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),i(p),(()=>{var e=i(m),t=e.firstChild.nextSibling;return n(t),e})(),i(h),i(g),e(l,{title:`filters`,get children(){return e(y,{get fallback(){return i(v)}})}}),i(_),e(c,{code:u,title:`filters-demo.tsx`})]}})}})}export{b as default};