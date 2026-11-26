const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/split-bitmap-text.demo-Dd8LUYv_.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,M as n,a as r,c as i,d as a,ht as o,p as s,z as c}from"./web-BTd9NawZ.js";import{c as l,i as u,o as d,t as f,u as p}from"./components-BiYutFnA.js";var m=`import { SplitBitmapText } from "pixi-solid";
import { BitmapFont } from "pixi.js";

BitmapFont.install({
  name: "GameFont",
  style: {
    fontFamily: "Arial",
    fontSize: 40,
  },
});

<SplitBitmapText
  text="Fast per-character animation"
  style={{ fontFamily: "GameFont", fontSize: 40, fill: "white" }}
/>;
`,h=`import { onTick, PixiCanvas, SplitBitmapText, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { BitmapFont } from "pixi.js";

const fontName = "SplitBitmapDemoFont";

BitmapFont.install({
  name: fontName,
  style: {
    fontFamily: "Arial",
    fontSize: 42,
    fill: "white",
  },
});

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  let splitTextRef: Pixi.SplitBitmapText | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    if (!splitTextRef) return;

    elapsed += ticker.deltaMS;
    splitTextRef.chars.forEach((character, index) => {
      character.y = Math.sin(elapsed * 0.004 + index * 0.45) * 12;
    });
  });

  return (
    <SplitBitmapText
      ref={(instance) => {
        splitTextRef = instance;
      }}
      text="Fast bitmap animation"
      style={{
        fontFamily: fontName,
        fontSize: 42,
        fill: "#fff4b3",
      }}
      charAnchor={{ x: 0.5, y: 1 }}
      x={20}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#4527a0">
    <DemoComponent />
  </PixiCanvas>
);
`,g=t(`<h1>Split Bitmap Text`),_=t(`<p><code>SplitBitmapText</code> renders text as separate bitmap text segments. Use the exposed <code>chars</code>, <code>words</code>, and <code>lines</code> arrays when you need to animate many text segments efficiently.`),v=t(`<p><code>SplitBitmapText</code> is a <code>Container</code>, not a sprite, so it does not have an outer <code>anchor</code> or <code>anchorX</code>/<code>anchorY</code> prop. Position the split text with <code>x</code>, <code>y</code>, or <code>position</code>; use <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> for the segment transform origins.`),y=t(`<p>Please see the <a href=https://pixijs.download/release/docs/text.SplitBitmapText.html>PixiJS SplitBitmapText docs</a> for detailed information about the PixiJS API.`),b=t(`<p><code>SplitBitmapText</code> uses a bitmap font atlas. Install or load the font before rendering the component. It is a good choice for long strings, frequently changing text, or many simultaneous per-character animations.`),x=t(`<h2 id=demo>Demo`),S=t(`<h2 id=code-example>Code example`),C=t(`<h2 id=bitmap-fonts>Bitmap fonts`),w=t(`<p>Install a bitmap font before creating <code>SplitBitmapText</code>:`),T=t(`<p>The component exposes the same <code>chars</code>, <code>words</code>, <code>lines</code>, <code>autoSplit</code>, and transform-origin props as <a><code>SplitText</code></a>. The character segments use bitmap text, so they inherit BitmapText's font atlas and glyph coverage requirements.`),E=t(`<span>`),D=i(()=>c(()=>import(`./split-bitmap-text.demo-Dd8LUYv_.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/split-bitmap-text.demo.tsx`);function O(){return e(l,{get children(){return e(u,{get children(){return[s(g),s(_),s(v),(()=>{var e=s(y),t=e.firstChild.nextSibling;return r(t),e})(),s(b),s(x),e(f,{title:`split-bitmap-text`,get children(){return e(D,{get fallback(){return s(E)}})}}),s(S),e(d,{code:h,title:`split-bitmap-text-demo.tsx`}),s(C),s(w),e(d,{code:m,title:`tsx`}),(()=>{var e=s(T),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling,i=o();return a(()=>p(`/components/split-text`),e=>{n(t,`href`,e),r(t,i)}),e})()]}})}})}export{O as default};