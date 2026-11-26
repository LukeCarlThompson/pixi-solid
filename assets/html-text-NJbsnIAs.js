const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/html-text.demo-DLbvDP6I.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { HTMLText, PixiCanvas, usePixiScreen } from "pixi-solid";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  return (
    <>
      <HTMLText
        text={"<p>HTML Text</p><p>This is a <strong>bold</strong> and <em>italic</em> text.</p>"}
        style={{
          fontFamily: "Arial",
          fontSize: 24,
          fill: "#e24f4fff",
          align: "right",
          padding: 20,
        }}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
      />
      <HTMLText
        text={\`<div class="outer">
<p>This text supports:</p>
<ul class="list">
    <li class="list__item">✨ Emojis</li>
    <li class="list__item">🎨 Custom CSS</li>
    <li class="list__item">📏 Custom word wrap sizing</li>
</ul>
</div>\`}
        style={{
          fontSize: 24,
          align: "left",
          fill: "#334455",
          cssOverrides: [".outer { line-height: 1.2; }", ".list { margin: 0; padding: 0; }"],
          wordWrap: true,
          wordWrapWidth: 300,
        }}
      />
      <HTMLText
        text={'<div style="padding: 10px">Scale mode nearest</div>'}
        style={{
          fontSize: 24,
          fill: "#04ff00ff",
        }}
        textureStyle={{
          scaleMode: "nearest",
        }}
      />
    </>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>HTML Text`),f=t(`<p>A SolidJS component that renders a PixiJS HTMLText.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.HTMLText.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./html-text.demo-DLbvDP6I.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/html-text.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`html-text`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`html-text-demo.tsx`})]}})}})}export{v as default};