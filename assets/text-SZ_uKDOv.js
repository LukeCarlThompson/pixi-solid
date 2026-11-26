const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/text.demo-CdT4jkrl.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { PixiCanvas, Text } from "pixi-solid";

const DemoComponent = () => {
  return (
    <Text
      text="Hello World"
      style={{
        fill: "white",
        fontSize: 68,
        fontFamily: "Arial",
      }}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Text`),f=t(`<p>A SolidJS component that renders a PixiJS <code>Text</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.Text.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./text.demo-CdT4jkrl.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/text.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`text`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`text-demo.tsx`})]}})}})}export{v as default};