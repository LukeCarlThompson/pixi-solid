const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/bitmap-text.demo-NcfMKmZj.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,n as c,o as l,t as u}from"./components-BiYutFnA.js";var d=`import { BitmapText, PixiCanvas, usePixiScreen } from "pixi-solid";
import { BitmapFont } from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Creating a bitmap version of a built in font instead of loading a custom one.
  BitmapFont.install({
    name: "MyCustomBitmapFont",
    resolution: 2,
    style: {
      fontFamily: "sans-serif",
      fontStyle: "italic",
      fontWeight: "bold",
      fontSize: 32,
      fill: "#9366cbff",
      dropShadow: {
        alpha: 0.5,
        blur: 2,
        distance: 1,
        angle: Math.PI * 0.5,
        color: "#000000",
      },
    },
  });

  return (
    <BitmapText
      text="Our cool custom bitmap font!"
      style={{
        fontFamily: "MyCustomBitmapFont",
        fontSize: 32,
        fill: 0xfff000,
        align: "center",
      }}
      anchor={0.5}
      x={pixiScreen.width * 0.5}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background={"#b3fffbff"}>
    <DemoComponent />
  </PixiCanvas>
);
`,f=t(`<h1>Bitmap Text`),p=t(`<p>A SolidJS component that renders a PixiJS <code>BitmapText</code>.`),m=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.BitmapText.html>PixiJS docs</a> for detailed information.`),h=t(`<h2 id=demo>Demo`),g=t(`<h2 id=code-example>Code example`),_=t(`<span>`),v=r(()=>a(()=>import(`./bitmap-text.demo-NcfMKmZj.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/bitmap-text.demo.tsx`);function y(){return e(o,{get children(){return e(s,{get children(){return[i(f),i(p),(()=>{var e=i(m),t=e.firstChild.nextSibling;return n(t),e})(),i(h),e(u,{title:`bitmap-text`,get children(){return e(v,{get fallback(){return i(_)}})}}),i(g),e(c,{get items(){return[{label:`sprite-demo.tsx`,content:e(l,{code:d,title:`tsx`})}]}})]}})}})}export{y as default};