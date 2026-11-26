const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/object-fit-container.demo-BjWa5Cgo.js","assets/web-BTd9NawZ.js","assets/CanvasPool-DtqSaXnh.js","assets/rolldown-runtime-hePW80VL.js","assets/dist-BWyuAgmK.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js","assets/object-fit-B53WMoQZ.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import type { JSX } from "@solidjs/web";
import { Container, Graphics, PixiCanvas, usePixiScreen } from "pixi-solid";
import type { ObjectFitMode, ObjectPosition } from "pixi-solid/utils";
import { ObjectFitContainer } from "pixi-solid/utils";
import { Rectangle } from "pixi.js";
import { createSignal } from "solid-js";

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

const DemoComponent = (props: {
  fitMode: ObjectFitMode;
  objectPosition: ObjectPosition;
  angle: number;
  observeBounds: boolean;
}): JSX.Element => {
  const pixiScreen = usePixiScreen();

  const frame = new Rectangle(0, 0, 400, 200);

  return (
    <Container
      x={pixiScreen.width * 0.5 - frame.width * 0.5}
      y={pixiScreen.height * 0.5 - frame.height * 0.5}
    >
      <Graphics
        ref={(graphics) => {
          graphics.rect(0, 0, frame.width, frame.height).fill("#aeff00");
        }}
      />

      <ObjectFitContainer
        width={frame.width}
        height={frame.height}
        fitMode={props.fitMode}
        objectPosition={props.objectPosition}
        observeBounds={props.observeBounds}
      >
        <Graphics
          angle={props.angle}
          ref={(graphics) => {
            graphics
              .rect(0, 0, 100, 100)
              .fill("#bc3232")
              .circle(50, 50, 30)
              .fill("#519d70")
              .roundRect(10, 40, 80, 20, 5)
              .fill("#6a3691");
          }}
        />
      </ObjectFitContainer>
    </Container>
  );
};

export const Demo = (): JSX.Element => {
  const [fitMode, setFitMode] = createSignal<ObjectFitMode>(fitModes[0]);
  const [objectPosition, setObjectPosition] = createSignal<ObjectPositionPreset>(positions[0]);
  const [angle, setAngle] = createSignal(10);
  const [observeBounds, setObserveBounds] = createSignal(false);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <label style={{ display: "inline-flex", gap: "0.5rem", "align-items": "center" }}>
        <span>Fit mode</span>
        <select
          value={fitMode()}
          onInput={(event) => {
            setFitMode(event.currentTarget.value as ObjectFitMode);
          }}
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
          onInput={(event) => {
            setObjectPosition(event.currentTarget.value as ObjectPositionPreset);
          }}
        >
          {positions.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>
      </label>

      {/* TODO: Add slider to adjust the object width and height */}

      <label style={{ display: "inline-flex", gap: "0.5rem", "align-items": "center" }}>
        <input
          type="checkbox"
          checked={observeBounds()}
          onChange={(event) => {
            setObserveBounds(event.currentTarget.checked);
          }}
        />
        <span>Observe Bounds</span>
      </label>

      <label style={{ display: "inline-flex", gap: "0.5rem", "align-items": "center" }}>
        <span>Angle ({angle().toFixed(0)}deg)</span>
      </label>
      <input
        type="range"
        min="0"
        max="360"
        value={angle()}
        onInput={(event) => {
          setAngle(Number(event.currentTarget.value));
        }}
      />

      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
        <DemoComponent
          fitMode={fitMode()}
          objectPosition={objectPosition()}
          angle={angle()}
          observeBounds={observeBounds()}
        />
      </PixiCanvas>
    </div>
  );
};
`,u=t(`<h1>ObjectFitContainer`),d=t(`<p><code>ObjectFitContainer</code> is a utility component from <code>pixi-solid/utils</code> that applies object-fit style scaling and positioning to its children inside a fixed width and height region.`),f=t(`<p>It is useful for when you want to declare a responsive area and have the children fit within that space.`),p=t(`<p>It supports these fit modes:`),m=t(`<ul><li><p><code>contain</code></p></li><li><p><code>cover</code></p></li><li><p><code>fill</code></p></li><li><p><code>scale-down</code></p></li><li><p><code>none`),h=t(`<p>It also supports these positions:`),g=t(`<ul><li><p><code>center</code> (default)</p></li><li><p><code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code></p></li><li><p><code>top-left</code>, <code>top-right</code>, <code>bottom-left</code>, <code>bottom-right</code></p></li><li><p><code>{ x: number, y: number }</code> where <code>0</code> is start, <code>0.5</code> is center, and <code>1</code> is end`),_=t(`<p>Use the <code>objectPosition</code> prop to set alignment.`),v=t(`<p><code>observeBounds</code> is an optional prop that, when set to <code>true</code>, checks the bounds on every tick to watch the container's dimensions and update the layout reactively. This has a higher performance cost due to calculating the bounds on every tick so should only be used when specifically required. If <code>false</code>, the layout will only be calculated on initial render.`),y=t(`<p>Import it from utils:`),b=t(`<h2 id=demo>Demo`),x=t(`<p>Use the controls to switch fit mode and position and compare the behavior.`),S=t(`<h2 id=code-example>Code example`),C=t(`<span>`),w=n(()=>i(()=>import(`./object-fit-container.demo-BjWa5Cgo.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13])),{export:`Demo`},`src/demos/object-fit-container.demo.tsx`);function T(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),r(p),r(m),r(h),r(g),r(_),r(v),r(y),e(s,{code:`import { ObjectFitContainer } from "pixi-solid/utils";`,title:`ts`}),r(b),r(x),e(c,{title:`object-fit-container`,get children(){return e(w,{get fallback(){return r(C)}})}}),r(S),e(s,{code:l,title:`demo-app.tsx`})]}})}})}export{T as default};