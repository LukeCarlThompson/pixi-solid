const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/render-layer.demo-Ftoazl0K.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/run_03-BMWUeCLM.js","assets/object-fit-B53WMoQZ.js","assets/sky-kt9IjSui.js","assets/eel-C4wBzGfg.js","assets/bird_05-B2MZaQL_.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { Container, PixiCanvas, RenderLayer, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading, Show } from "solid-js";

import birdAssetUrl from "@/assets/bird_05.png";
import eelAssetUrl from "@/assets/eel.png";
import runAssetUrl from "@/assets/run_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const assetsReady = createMemo(async () => {
    await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
      { alias: "run", src: runAssetUrl },
      { alias: "eel", src: eelAssetUrl },
    ]);
    return true;
  });

  let birdRef: Pixi.Sprite | undefined;
  let characterRef: Pixi.Sprite | undefined;
  let eelRef: Pixi.Sprite | undefined;

  return (
    <Loading>
      <Show when={assetsReady()}>
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode={"cover"}>
          <Sprite texture={Assets.get("sky")} />
        </ObjectFitContainer>
        <Container x={pixiScreen.width * 0.5} y={pixiScreen.height * 0.5} scale={3}>
          <Sprite texture={Assets.get("bird")} ref={birdRef} anchor={0.5} x={-10} y={-20} />
          <Sprite texture={Assets.get("run")} ref={characterRef} anchor={0.5} />
        </Container>
        <Sprite
          texture={Assets.get("eel")}
          x={pixiScreen.width * 0.5}
          y={pixiScreen.height * 0.5}
          anchor={0.5}
          ref={(sprite) => {
            eelRef = sprite;
          }}
        />
        {/* Set a custom render order by arranging out scene objects in a different order in the RenderLayer */}
        <RenderLayer>
          <Container as={eelRef} />
          <Container as={characterRef} />
          <Container as={birdRef} />
        </RenderLayer>
      </Show>
    </Loading>
  );
};

export const Demo = () => (
  <Loading fallback={<div>Loading...</div>}>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </Loading>
);
`,d=t(`<h1>Render Layer`),f=t(`<p>A SolidJS component that renders a PixiJS <code>RenderLayer</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.RenderLayer.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./render-layer.demo-Ftoazl0K.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])),{export:`Demo`},`src/demos/render-layer.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`render-layer`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`render-layer-demo.tsx`})]}})}})}export{v as default};