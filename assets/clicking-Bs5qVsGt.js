const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/clicking.demo-CKQ5VnZQ.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,s as c,t as l}from"./components-BiYutFnA.js";var u=`import { Graphics, PixiCanvas, Text, usePixiScreen } from "pixi-solid";
import { DEG_TO_RAD } from "pixi.js";
import { createSignal } from "solid-js";

const ClickingDemo = () => {
  const screen = usePixiScreen();
  const [numberOfClicks, setNumberOfClicks] = createSignal(0);
  const textValue = () => \`Number of clicks: \${numberOfClicks()}\`;

  const handleClick = () => {
    setNumberOfClicks((prev) => prev + 1);
  };

  return (
    <>
      <Text
        text={textValue()}
        style={{ fill: "#ffffff", align: "center" }}
        anchor={0.5}
        x={screen.width * 0.5}
        y={screen.height * 0.1}
      />
      <Graphics
        ref={(graphics) => {
          graphics.roundRect(-70, -30, 140, 60, 8).fill("#0099ff");
        }}
        eventMode={"static"}
        cursor={"pointer"}
        onclick={handleClick}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
      />
      <Text
        text={"Click me!"}
        style={{
          fill: "#ffffff",
          align: "center",
          fontSize: 18,
          padding: 5,
          dropShadow: {
            alpha: 0.5,
            blur: 2,
            distance: 2,
            angle: 90 * DEG_TO_RAD,
            color: "#000000",
          },
        }}
        anchor={0.5}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
      />
    </>
  );
};

export const Demo = () => (
  <PixiCanvas
    style={{ "aspect-ratio": "2/1.5" }}
    antialias={true}
    resolution={window.devicePixelRatio}
  >
    <ClickingDemo />
  </PixiCanvas>
);
`,d=t(`<h1>Clicking`),f=t(`<p>An example of using the <code>onclick</code> event handler on a pixi-solid element.`),p=t(`<code>onclick`),m=t(`<code>ontap`),h=t(`<code>onpointertap`),g=t(`<h2 id=demo>Demo`),_=t(`<h2 id=code-example>Code example`),v=t(`<span>`),y=n(()=>i(()=>import(`./clicking.demo-CKQ5VnZQ.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/clicking.demo.tsx`);function b(){return e(a,{get children(){return e(o,{get children(){return[r(d),r(f),e(c,{tone:`note`,get children(){return[`The `,r(p),` event is for mouse clicks only, use `,r(m),` for only touch events or `,r(h),`for both mouse and touch events.`]}}),r(g),e(l,{title:`clicking`,get children(){return e(y,{get fallback(){return r(v)}})}}),r(_),e(s,{code:u,title:`demo-app.tsx`})]}})}})}export{b as default};