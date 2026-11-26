const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/container.demo-BI7j9mXt.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,a as n,c as r,p as i,z as a}from"./web-BTd9NawZ.js";import{c as o,i as s,o as c,t as l}from"./components-BiYutFnA.js";var u=`import { Container, Graphics, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  let outer: Pixi.Container | undefined;
  let inner: Pixi.Container | undefined;
  let cumulativeDeltaTime = 0;

  // Rotate the parent container every frame
  onTick((ticker) => {
    if (outer) outer.angle += 1 * ticker.deltaTime;
  });

  // Move the inner container side to side
  onTick((ticker) => {
    if (!inner) return;

    cumulativeDeltaTime += 0.1 * ticker.deltaTime;
    inner.position.x = Math.sin(cumulativeDeltaTime) * 100;
  });

  return (
    <Container
      x={pixiScreen.width * 0.5}
      y={pixiScreen.height * 0.5}
      ref={(container) => (outer = container)}
    >
      <Container ref={(container) => (inner = container)}>
        <Graphics
          ref={(graphics) => {
            // Draw a graphic so we can see the result
            graphics.rect(-50, -50, 100, 100).fill("#ffffff");
          }}
        />
      </Container>
    </Container>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
`,d=t(`<h1>Container`),f=t(`<p>A SolidJS component that renders a PixiJS <code>Container</code>.`),p=t(`<p>Please see the <a href=https://pixijs.download/release/docs/scene.Container.html>PixiJS docs</a> for detailed information.`),m=t(`<h2 id=demo>Demo`),h=t(`<h2 id=code-example>Code example`),g=t(`<span>`),_=r(()=>a(()=>import(`./container.demo-BI7j9mXt.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/container.demo.tsx`);function v(){return e(o,{get children(){return e(s,{get children(){return[i(d),i(f),(()=>{var e=i(p),t=e.firstChild.nextSibling;return n(t),e})(),i(m),e(l,{title:`container`,get children(){return e(_,{get fallback(){return i(g)}})}}),i(h),e(c,{code:u,title:`demo-app.tsx`})]}})}})}export{v as default};