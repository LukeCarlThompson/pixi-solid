const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/animated-sprite.demo-CVPHr-UE.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/Assets-D-FVVTjl.js","assets/checkExtension-BGvys2BB.js","assets/run_06-CTyTGqHK.js","assets/run_03-BMWUeCLM.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,r as l,t as u}from"./components-BiYutFnA.js";var d=`import { AnimatedSprite, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl_01 from "@/assets/run_01.png";
import assetUrl_02 from "@/assets/run_02.png";
import assetUrl_03 from "@/assets/run_03.png";
import assetUrl_04 from "@/assets/run_04.png";
import assetUrl_05 from "@/assets/run_05.png";
import assetUrl_06 from "@/assets/run_06.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  const textures = createMemo(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const runTextures = await Assets.load<Pixi.Texture>([
      assetUrl_01,
      assetUrl_02,
      assetUrl_03,
      assetUrl_04,
      assetUrl_05,
      assetUrl_06,
    ]);

    return Object.values(runTextures);
  });

  return (
    <Loading>
      <AnimatedSprite
        autoPlay={true}
        textures={textures()}
        scale={3}
        animationSpeed={0.25}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DemoComponent />
  </PixiCanvas>
);
`,f=t(`<h1>Animated Sprite`),p=t(`<p>A SolidJS component that renders a PixiJS <code>AnimatedSprite</code>.`),m=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.AnimatedSprite.html>PixiJS docs</a> for detailed information.`),h=t(`<h2 id=props>Props`),g=t(`<p><code>AnimatedSprite</code> accepts all standard sprite props (anchor, event handlers, point-axis shorthands) plus the following <code>AnimatedSprite</code>-specific options:`),_=t(`<thead><tr><th>Prop</th><th>Type</th><th>Description`),v=t(`<tbody><tr><td><code>textures</code></td><td><code>Pixi.Texture[]</code></td><td>Array of textures to cycle through</td></tr><tr><td><code>playing</code></td><td><code>boolean</code></td><td>Whether the animation is currently playing (default <code>true</code>)</td></tr><tr><td><code>loop</code></td><td><code>boolean</code></td><td>Whether the animation loops (default <code>true</code>)</td></tr><tr><td><code>animationSpeed</code></td><td><code>number</code></td><td>Speed multiplier for the animation (default <code>1</code>)</td></tr><tr><td><code>autoUpdate</code></td><td><code>boolean</code></td><td>See autoUpdate behavior below (default <code>true</code>)`),y=t(`<h2 id=autoupdate-behavior>autoUpdate behavior`),b=t(`<p><code>AnimatedSprite</code> in <code>pixi-solid</code> <code>autoUpdate</code> behavior intentionally differs from PixiJS defaults to integrate with the <code>pixi-solid</code> ticker context providers.`),x=t(`<p>In PixiJS:`),S=t(`<ul><li><p><code>AnimatedSprite</code> default behavior or with <code>autoUpdate: true</code> updates itself with the <code>Ticker.shared</code>.`),C=t(`<p>In <code>pixi-solid</code>:`),w=t(`<ul><li><p><code>AnimatedSprite</code> default behavior or with <code>autoUpdate={true}</code> updates itself with the ticker in the nearest parent <code>Ticker</code> context provider. Either a <code>PixiCanvas</code> or <code>TickerProvider</code>.`),T=t(`<p>This avoids accidentally mixing multiple tickers and makes <code>AnimatedSprite</code> behavior consistent with the rest of the <code>pixi-solid</code> lifecycle utilities.`),E=t(`<h2 id=practical-guidance>Practical guidance`),D=t(`<ul><li><p>Use the default behavior (omit <code>autoUpdate</code>) for most apps. This keeps animation timing bound to your app's configured ticker.</p></li><li><p>Set <code>autoUpdate={false}</code> and access the instance via a <code>ref</code> and manually call the <code>update</code> method if you want full manual control over frame updates.`),O=t(`<h2 id=demo>Demo`),k=t(`<h2 id=code-example>Code example`),A=t(`<span>`),j=r(()=>a(()=>import(`./animated-sprite.demo-CVPHr-UE.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])),{export:`Demo`},`src/demos/animated-sprite.demo.tsx`);function M(){return e(o,{get children(){return e(s,{get children(){return[i(f),i(p),(()=>{var e=i(m),t=e.firstChild.nextSibling;return n(t),e})(),i(h),i(g),e(l,{get children(){return[i(_),i(v)]}}),i(y),i(b),i(x),i(S),i(C),i(w),i(T),i(E),i(D),i(O),e(u,{title:`animated-sprite`,get children(){return e(j,{get fallback(){return i(A)}})}}),i(k),e(c,{code:d,title:`demo-app.tsx`})]}})}})}export{M as default};