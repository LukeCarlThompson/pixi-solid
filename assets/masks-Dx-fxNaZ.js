const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/masks.demo-B7YbvGWp.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/object-fit-B53WMoQZ.js","assets/sky-kt9IjSui.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { Container, Graphics, PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading, onCleanup } from "solid-js";

import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const skyTexture = createMemo(() => Assets.load<Pixi.Texture>(skyAssetUrl));

  let graphicsRef: Pixi.Graphics | undefined;

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!graphicsRef) return;

    graphicsRef.position.set(e.screenX, e.screenY);
  };

  onCleanup(() => {
    if (graphicsRef) graphicsRef.destroy();
  });

  return (
    <Loading>
      <Container onglobalpointermove={handlePointerMove} eventMode="static">
        <Graphics
          ref={(instance) => {
            graphicsRef = instance;
            instance.circle(0, 0, 100).fill(0x000000);
          }}
        />
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
          <Sprite label="sky" texture={skyTexture()} mask={graphicsRef} />
        </ObjectFitContainer>
      </Container>
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Masks`),f=t(`<p>Masks work the same way as in PixiJS. The object being used as a masks needs to be added to the <code>Stage</code> and set as a <code>mask</code> property on the object to be masked.`),p=t(`<p>Please see the <a href=https://pixijs.com/8.x/guides/components/scene-objects#masking-scene-objects>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<p>Move your mouse across the screen to change the mask position.`),g=t(`<h2 id=code-example>Code example`),_=t(`<span>`),v=r(()=>a(()=>import(`./masks.demo-B7YbvGWp.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])),{export:`Demo`},`src/demos/masks.demo.tsx`);function y(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),i(h),e(l,{title:`masks`,get children(){return e(v,{get fallback(){return i(_)}})}}),i(g),e(c,{code:u,title:`masks-demo.tsx`})]}})}})}export{y as default};