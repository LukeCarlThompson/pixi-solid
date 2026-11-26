const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/object-fit.demo-CfR8QvcM.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/object-fit-B53WMoQZ.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,M as n,a as r,c as i,d as a,ht as o,p as s,z as c}from"./web-BTd9NawZ.js";import{c as l,i as u,o as d,t as f,u as p}from"./components-BiYutFnA.js";var m=`import type { JSX } from "@solidjs/web";
import { Container, Graphics, PixiCanvas, usePixiScreen } from "pixi-solid";
import type { ObjectFitMode, ObjectPosition } from "pixi-solid/utils";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { createEffect, createSignal } from "solid-js";

const fitModes: ObjectFitMode[] = ["contain", "cover", "fill", "scale-down", "none"];
type ObjectPositionPreset = Exclude<ObjectPosition, { x?: number; y?: number }>;
const positions: ObjectPositionPreset[] = [
  "center",
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const bounds = { width: 400, height: 200 };

const DemoScene = (props: { fitMode: ObjectFitMode; objectPosition: ObjectPositionPreset }) => {
  const pixiScreen = usePixiScreen();
  let graphicsRef: Pixi.Graphics | undefined;

  createEffect(
    () => [props.fitMode, props.objectPosition] as const,
    ([fitMode, objectPosition]) => {
      if (!graphicsRef) return;
      objectFit(graphicsRef, bounds, fitMode, objectPosition);
    },
  );

  return (
    <Container
      x={pixiScreen.width * 0.5 - bounds.width * 0.5}
      y={pixiScreen.height * 0.5 - bounds.height * 0.5}
    >
      <Graphics
        ref={(g) => {
          g.rect(0, 0, bounds.width, bounds.height).fill("#aeff00");
        }}
      />
      <Graphics
        ref={(g) => {
          graphicsRef = g;
          g.rect(0, 0, 100, 200).fill("#bc3232").circle(50, 100, 35).fill("#519d70");
        }}
      />
    </Container>
  );
};

export const Demo = (): JSX.Element => {
  const [fitMode, setFitMode] = createSignal<ObjectFitMode>("contain");
  const [objectPosition, setObjectPosition] = createSignal<ObjectPositionPreset>("center");

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <label style={{ display: "inline-flex", gap: "0.5rem", "align-items": "center" }}>
        <span>Fit mode</span>
        <select
          value={fitMode()}
          onInput={(e) => setFitMode(e.currentTarget.value as ObjectFitMode)}
        >
          {fitModes.map((mode) => (
            <option value={mode}>{mode}</option>
          ))}
        </select>
      </label>
      <label style={{ display: "inline-flex", gap: "0.5rem", "align-items": "center" }}>
        <span>Position</span>
        <select
          value={objectPosition()}
          onInput={(e) => setObjectPosition(e.currentTarget.value as ObjectPositionPreset)}
        >
          {positions.map((pos) => (
            <option value={pos}>{pos}</option>
          ))}
        </select>
      </label>
      <PixiCanvas style={{ width: "100%", height: "300px" }}>
        <DemoScene fitMode={fitMode()} objectPosition={objectPosition()} />
      </PixiCanvas>
    </div>
  );
};
`,h=t(`<h1>objectFit`),g=t(`<p><code>objectFit</code> is a utility function from <code>pixi-solid/utils</code> that imperatively applies object-fit style scaling and positioning to any <code>Pixi.Container</code>.`),_=t(`<p>Unlike the <a><code>ObjectFitContainer</code></a> component, which wraps children and manages reactive updates automatically, <code>objectFit</code> is a one-shot imperative call. It is well-suited for use inside <code>ref</code> callbacks, <code>createEffect</code>, event handlers, or anywhere you need direct control over when the fit is applied.`),v=t(`<p>It supports these fit modes:`),y=t(`<ul><li><p><code>contain</code> — scale uniformly to fit within bounds, preserving aspect ratio</p></li><li><p><code>cover</code> — scale uniformly to fill bounds, preserving aspect ratio (may clip)</p></li><li><p><code>fill</code> — stretch to fill bounds exactly, ignoring aspect ratio</p></li><li><p><code>scale-down</code> — same as <code>contain</code> but never scales up beyond original size</p></li><li><p><code>none</code> — no scaling applied`),b=t(`<p>It also supports these positions:`),x=t(`<ul><li><p><code>center</code> (default)</p></li><li><p><code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code></p></li><li><p><code>top-left</code>, <code>top-right</code>, <code>bottom-left</code>, <code>bottom-right</code></p></li><li><p><code>{ x: number, y: number }</code> where <code>0</code> is start, <code>0.5</code> is center, and <code>1</code> is end`),S=t(`<p>Import it from utils:`),C=t(`<h2 id=signature>Signature`),w=t(`<p>The function mutates <code>object.scale</code>, <code>object.x</code>, and <code>object.y</code> in place. It reads the object's local bounds via <code>getLocalBounds()</code> to determine the original dimensions before scaling.`),T=t(`<h2 id=usage-in-a-ref>Usage in a ref`),E=t(`<p>The most common use is inside a <code>ref</code> callback to fit a container once on mount:`),D=t(`<h2 id=reactive-usage-with-createeffect>Reactive usage with createEffect`),O=t(`<p>To re-apply whenever a signal changes, use <code>createEffect</code>:`),k=t(`<h2 id=demo>Demo`),A=t(`<h2 id=code-example>Code example`),j=t(`<span>`),M=i(()=>c(()=>import(`./object-fit.demo-CfR8QvcM.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13])),{export:`Demo`},`src/demos/object-fit.demo.tsx`);function N(){return e(l,{get children(){return e(u,{get children(){return[s(h),s(g),(()=>{var e=s(_),t=e.firstChild.nextSibling,i=o();return a(()=>p(`/utils/object-fit-container`),e=>{n(t,`href`,e),r(t,i)}),e})(),s(v),s(y),s(b),s(x),s(S),e(d,{code:`import { objectFit } from "pixi-solid/utils";`,title:`ts`}),s(C),e(d,{code:`objectFit(
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
  position?: ObjectPosition,
): void`,title:`ts`}),s(w),s(T),s(E),e(d,{code:`import { objectFit } from "pixi-solid/utils";

<Graphics
  ref={(graphics) => {
    graphics.rect(0, 0, 200, 100).fill(0xff0000);
    objectFit(graphics, { width: 400, height: 300 }, "contain");
  }}
/>;`,title:`tsx`}),s(D),s(O),e(d,{code:`import { objectFit } from "pixi-solid/utils";
import { createEffect, createSignal } from "solid-js";

const [fitMode, setFitMode] = createSignal("contain");
let graphicsRef;

createEffect(() => {
  if (!graphicsRef) return;
  objectFit(graphicsRef, { width: 400, height: 300 }, fitMode());
});

<Graphics
  ref={(g) => {
    graphicsRef = g;
    g.rect(0, 0, 200, 100).fill(0xff0000);
    objectFit(g, { width: 400, height: 300 }, fitMode());
  }}
/>;`,title:`tsx`}),s(k),e(f,{title:`object-fit`,get children(){return e(M,{get fallback(){return s(j)}})}}),s(A),e(d,{code:m,title:`demo-app.tsx`})]}})}})}export{N as default};