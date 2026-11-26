const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dragging.demo-aXArlTTJ.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import { Graphics, PixiCanvas } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { FillGradient } from "pixi.js";
import { createSignal } from "solid-js";

const DraggingDemo = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [x, setX] = createSignal(100);
  const [y, setY] = createSignal(100);

  const scale = () => (isDragging() ? 1.1 : 1);

  // A point-shaped object backed by signals. Pixi writes into it directly (\`toLocal\` assigns
  // \`point.x\`/\`point.y\`), so the handlers below need no copying and allocate nothing per frame.
  const pointerPosition = {
    get x() {
      return x();
    },
    set x(value: number) {
      setX(value);
    },
    get y() {
      return y();
    },
    set y(value: number) {
      setY(value);
    },
  };

  let dragTarget: Pixi.Container | undefined;

  const handlePointerDown = (e: Pixi.FederatedPointerEvent) => {
    dragTarget = e.target;
    setIsDragging(true);

    if (!e.target.parent) return;
    // Convert the global coords to the targets parent coordinate space
    e.target.parent.toLocal(e.global, undefined, pointerPosition);
  };

  const handlePointerUp = () => {
    dragTarget = undefined;
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
      scale={scale()}
      x={pointerPosition.x}
      y={pointerPosition.y}
    />
  );
};

export const Demo = () => (
  <PixiCanvas
    style={{ "aspect-ratio": "2/1.5" }}
    antialias={true}
    resolution={window.devicePixelRatio}
  >
    <DraggingDemo />
  </PixiCanvas>
);
`,u=t(`<h1>Dragging`),d=t(`<p>An example of using event handlers to create dragging functionality.`),f=t(`<h2 id=demo>Demo`),p=t(`<h2 id=code-example>Code example`),m=t(`<span>`),h=n(()=>i(()=>import(`./dragging.demo-aXArlTTJ.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/dragging.demo.tsx`);function g(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),e(c,{title:`dragging`,get children(){return e(h,{get fallback(){return r(m)}})}}),r(p),e(s,{code:l,title:`demo-app.tsx`})]}})}})}export{g as default};