const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/use-spring.demo-fA9FV8qE.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import { Graphics, PixiCanvas } from "pixi-solid";
import { useSpring } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { FillGradient } from "pixi.js";
import { createSignal } from "solid-js";

const DraggingDemo = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const pointerPosition = { x: 100, y: 100 };

  const draggingScale = 1.4;
  const droppedScale = 0.8;
  let scaleTarget = droppedScale;

  const springyScale = useSpring({
    to: () => scaleTarget,
    damping: () => (isDragging() ? 50 : 100),
    stiffness: () => (isDragging() ? 80 : 100),
    mass: () => 20,
  });

  const springyPositionX = useSpring({
    to: () => pointerPosition.x,
    damping: () => (isDragging() ? 50 : 100),
    stiffness: () => (isDragging() ? 40 : 100),
  });

  const springyPositionY = useSpring({
    to: () => pointerPosition.y,
    damping: () => (isDragging() ? 60 : 100),
    stiffness: () => (isDragging() ? 30 : 100),
  });

  let dragTarget: Pixi.Container | undefined;

  const handlePointerDown = (e: Pixi.FederatedPointerEvent) => {
    dragTarget = e.target;
    scaleTarget = draggingScale;
    setIsDragging(true);

    if (!e.target.parent) return;
    // Calculate the offset from the dragTarget's local origin to the click point
    e.target.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const handlePointerUp = () => {
    dragTarget = undefined;
    scaleTarget = droppedScale;
    setIsDragging(false);
  };

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!dragTarget || !dragTarget.parent) return;
    dragTarget.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const gradient = new FillGradient({
    type: "linear",
    colorStops: [
      { offset: 0, color: "#b6e3ff" },
      { offset: 1, color: "#0099ff" },
    ],
  });

  return (
    <Graphics
      ref={(graphics) => {
        graphics.roundRect(-50, -50, 100, 100, 20).fill(gradient);
      }}
      eventMode={"static"}
      cursor={isDragging() ? "grabbing" : "grab"}
      onpointerdown={handlePointerDown}
      onpointerup={handlePointerUp}
      onpointerupoutside={handlePointerUp}
      onglobalpointermove={handlePointerMove}
      angle={springyPositionX.velocity() * 0.05}
      scale={springyScale.value()}
      x={springyPositionX.value()}
      y={springyPositionY.value()}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DraggingDemo />
  </PixiCanvas>
);
`,u=t(`<h1>useSpring`),d=t(`<p>The <code>useSpring</code> function provides reactive SolidJS signals for creating physically-based spring animations for numeric values.`),f=t(`<h2 id=return-value>Return Value`),p=t(`<p>The function returns an object with the following properties:`),m=t(`<ul><li><p><strong><code>value</code></strong> - An accessor signal containing the current spring-animated value</p></li><li><p><strong><code>velocity</code></strong> - An accessor signal containing the current velocity of the spring</p></li><li><p><strong><code>setValue</code></strong> - A function to set the current value directly, bypassing physics calculations for that frame. This allows you to "teleport" the spring to a specific value. The velocity will continue to be calculated normally on the next frame.`),h=t(`<h2 id=behavior>Behavior`),g=t(`<p>The function internally manages the spring physics calculations and keeps its updates synchronized with the PixiJS application's ticker, ensuring smooth and responsive animations that align with your application's frame rate.`),_=t(`<p>It must be called within a SolidJS tracking scope, such as a component or another function, that is a descendant of <code>PixiApplicationProvider</code>, <code>PixiCanvas</code>, or <code>TickerProvider</code>.`),v=t(`<h2 id=demo>Demo`),y=t(`<p>Taking our earlier <code>useSmoothDamp</code> demo and applying <code>useSpring</code> gives us an altogether different feeling motion.`),b=t(`<h2 id=code-example>Code example`),x=t(`<span>`),S=n(()=>i(()=>import(`./use-spring.demo-fA9FV8qE.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/use-spring.demo.tsx`);function C(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),r(p),r(m),r(h),r(g),r(_),r(v),r(y),e(c,{title:`use-spring`,get children(){return e(S,{get fallback(){return r(x)}})}}),r(b),e(s,{code:l,title:`demo-app.tsx`})]}})}})}export{C as default};