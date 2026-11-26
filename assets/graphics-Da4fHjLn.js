const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/graphics.demo-CjhfvMI5.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { Graphics, PixiCanvas, usePixiScreen } from "pixi-solid";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  return (
    <>
      <Graphics
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        draw={(graphics) => {
          graphics.rect(-50, -50, 100, 100).fill("#ffd500ff");
        }}
      />
      <Graphics
        draw={(graphics) => {
          graphics.rect(50, 50, 100, 200).fill(0xff0000).circle(200, 200, 50).stroke(0x00ff00);
        }}
      />
      <Graphics
        draw={(graphics) => {
          graphics.svg(\`<svg>
                          <path d="M 100 300 q 150 200 300 100" stroke="blue" stroke-width="5" fill="pink" />
                        </svg>\`);
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
`,d=t(`<h1>Graphics`),f=t(`<p>A SolidJS component that renders a PixiJS <code>Graphics</code>.`),p=t(`<p>Draw with the <code>draw</code> prop. The callback runs once, then again whenever a reactive value it reads changes. The instance is cleared before every run, so the callback describes the whole content and a re-run replaces the previous drawing:`),m=t(`<p>Because the callback tracks what it reads, a drawing follows the values it uses:`),h=t(`<p>A value that changes every frame redraws every frame. For per-frame work, animate the instance from <code>onTick</code> instead and keep <code>draw</code> for content that follows discrete changes.`),g=t(`<h2 id=demo>Demo`),_=t(`<h2 id=code-example>Code example`),v=t(`<h2 id=reading-the-instance>Reading the instance`),y=t(`<p>Use <code>ref</code> for anything that is not drawing, such as reading bounds:`),b=t(`<p>See the <a href=https://pixijs.download/release/docs/scene.Graphics.html>PixiJS docs</a> for the full drawing API.`),x=t(`<span>`),S=r(()=>a(()=>import(`./graphics.demo-CjhfvMI5.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/graphics.demo.tsx`);function C(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),i(p),e(c,{code:`<Graphics
  draw={(graphics) => {
    graphics.rect(50, 50, 100, 200).fill(0xff0000).circle(200, 200, 50).stroke(0x00ff00);
  }}
/>;`,title:`tsx`}),i(m),e(c,{code:`import { Graphics } from "pixi-solid";

const Circle = (props: { radius: number }) => (
  <Graphics
    draw={(graphics) => {
      graphics.circle(0, 0, props.radius).fill("#ffd500ff");
    }}
  />
);

// Pass a signal read and the circle redraws when the radius changes.
<Circle radius={radius()} />;`,title:`tsx`}),i(h),i(g),e(l,{title:`graphics`,get children(){return e(S,{get fallback(){return i(x)}})}}),i(_),e(c,{code:u,title:`graphics-demo.tsx`}),i(v),i(y),e(c,{code:`let graphics: Pixi.Graphics | undefined;

onSettled(() => {
  const bounds = graphics?.getLocalBounds();
});`,title:`tsx`}),(()=>{var e=i(b),t=e.firstChild.nextSibling;return n(t),e})()]}})}})}export{C as default};