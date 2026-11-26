const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/split-text.demo-CXcZshW_.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,M as n,a as r,c as i,d as a,ht as o,p as s,z as c}from"./web-BTd9NawZ.js";import{c as l,i as u,o as d,t as f,u as p}from"./components-BiYutFnA.js";var m=`import { onTick, PixiCanvas, SplitText, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  let splitTextRef: Pixi.SplitText | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    if (!splitTextRef) return;

    elapsed += ticker.deltaMS;
    splitTextRef.chars.forEach((character, index) => {
      character.y = Math.sin(elapsed * 0.004 + index * 0.45) * 12;
    });
  });

  return (
    <SplitText
      ref={(instance) => {
        splitTextRef = instance;
      }}
      text="Animate every character"
      style={{
        fontFamily: "Arial",
        fontSize: 42,
        fill: "white",
        stroke: { color: "#263238", width: 4 },
      }}
      x={20}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
`,h=t(`<h1>Split Text`),g=t(`<p><code>SplitText</code> renders text as separate line, word, and character objects. Use the exposed <code>chars</code>, <code>words</code>, and <code>lines</code> arrays when you need to animate text segments independently.`),_=t(`<p><code>SplitText</code> is a <code>Container</code>, not a sprite, so it does not have an outer <code>anchor</code> or <code>anchorX</code>/<code>anchorY</code> prop. Position the split text with <code>x</code>, <code>y</code>, or <code>position</code>; use <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> for the segment transform origins.`),v=t(`<p>Please see the <a href=https://pixijs.download/release/docs/text.SplitText.html>PixiJS SplitText docs</a> for detailed information about the PixiJS API.`),y=t(`<p><code>SplitText</code> uses regular canvas <code>Text</code> objects for its characters. It is a good choice for short, highly styled strings. For long strings or many animated text instances, use <a><code>SplitBitmapText</code></a> instead.`),b=t(`<h2 id=demo>Demo`),x=t(`<h2 id=code-example>Code example`),S=t(`<h2 id=segment-collections>Segment collections`),C=t(`<p>The component exposes three collections:`),w=t(`<ul><li><p><code>chars</code> contains each character <code>Text</code> instance.</p></li><li><p><code>words</code> contains containers for each word.</p></li><li><p><code>lines</code> contains containers for each line.`),T=t(`<p>Set <code>charAnchor</code>, <code>wordAnchor</code>, and <code>lineAnchor</code> to control the transform origin for each collection. <code>autoSplit</code> is enabled by default, so changing <code>text</code> or <code>style</code> rebuilds the segment collections.`),E=t(`<span>`),D=i(()=>c(()=>import(`./split-text.demo-CXcZshW_.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/split-text.demo.tsx`);function O(){return e(l,{get children(){return e(u,{get children(){return[s(h),s(g),s(_),(()=>{var e=s(v),t=e.firstChild.nextSibling;return r(t),e})(),(()=>{var e=s(y),t=e.firstChild.nextSibling.nextSibling.nextSibling.nextSibling,i=o();return a(()=>p(`/components/split-bitmap-text`),e=>{n(t,`href`,e),r(t,i)}),e})(),s(b),e(f,{title:`split-text`,get children(){return e(D,{get fallback(){return s(E)}})}}),s(x),e(d,{code:m,title:`split-text-demo.tsx`}),s(S),s(C),s(w),s(T),e(d,{code:`<SplitText
  text="Animate each character"
  style={{ fontSize: 40, fill: "white" }}
  charAnchor={{ x: 0.5, y: 1 }}
  wordAnchor={{ x: 0, y: 0.5 }}
  lineAnchor={0.5}
/>;`,title:`tsx`})]}})}})}export{O as default};