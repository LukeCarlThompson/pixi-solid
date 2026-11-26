const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/html-and-pixi.demo-t8Hmy9UE.js","assets/web-BTd9NawZ.js","assets/dist-BWyuAgmK.js","assets/rolldown-runtime-hePW80VL.js","assets/CanvasPool-DtqSaXnh.js","assets/Filter-tmaoo_H6.js","assets/canvasUtils-BmkL-0m_.js","assets/Cache-DjsX-fAq.js","assets/RenderTargetSystem-CXGlBGSL.js","assets/GCManagedHash-iaZqB6Fm.js","assets/GraphicsContext-oKSnaaQD.js","assets/getTextureBatchBindGroup-CPqe_4fB.js","assets/getTexelRangeRects-7j664Y_P.js"])))=>i.map(i=>d[i]);
import{J as e,L as t,c as n,p as r,z as i}from"./web-BTd9NawZ.js";import{c as a,i as o,o as s,t as c}from"./components-BiYutFnA.js";var l=`import type { JSX } from "@solidjs/web";
import { Graphics, PixiApplicationProvider, PixiCanvas, usePixiScreen } from "pixi-solid";
import { createSignal, For } from "solid-js";

type ControlsProps = {
  scale: number;
  angle: number;
  numSquares: number;
  onScaleChanged: (value: number) => void;
  onAngleChanged: (value: number) => void;
  onNumSquaresChanged: (value: number) => void;
};

const Controls = (props: ControlsProps) => (
  <div
    style={{
      position: "absolute",
      top: "10px",
      left: "20px",
      display: "flex",
      "flex-direction": "column",
      gap: "12px",
    }}
  >
    <label style={{ "font-size": "14px", "font-weight": "bold" }} for="scale">
      Scale: {props.scale.toFixed(1)}x
    </label>
    <input
      type="range"
      min="0.5"
      max="3"
      step="0.1"
      id={"scale"}
      value={props.scale}
      onInput={(e) => props.onScaleChanged(parseFloat(e.currentTarget.value))}
      style={{
        cursor: "pointer",
        width: "150px",
      }}
    />
    <label style={{ "font-size": "14px", "font-weight": "bold" }} for="angle">
      Angle: {props.angle.toFixed(0)}°
    </label>
    <input
      type="range"
      min="0"
      max="360"
      step="1"
      id={"angle"}
      value={props.angle}
      onInput={(e) => props.onAngleChanged(parseFloat(e.currentTarget.value))}
      style={{
        cursor: "pointer",
        width: "150px",
      }}
    />
    <label style={{ "font-size": "14px", "font-weight": "bold" }} for="numSquares">
      Number of squares: {props.numSquares}
    </label>
    <input
      type="range"
      min="1"
      max="10"
      step="1"
      id={"numSquares"}
      value={props.numSquares}
      onInput={(e) => props.onNumSquaresChanged(parseInt(e.currentTarget.value))}
      style={{
        cursor: "pointer",
        width: "150px",
      }}
    />
  </div>
);

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const [scale, setScale] = createSignal(1);
  const [angle, setAngle] = createSignal(0);
  const [numSquares, setNumSquares] = createSignal(1);

  return (
    <div style={{ position: "relative" }}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <For each={Array.from({ length: numSquares() })}>
          {(_, index) => {
            const spacing = 70;
            const startX = 50;
            const xPos = startX + index() * spacing;

            return (
              <Graphics
                ref={(graphics) => {
                  graphics.rect(-25, -25, 50, 50).fill("#ffd500ff");
                }}
                x={xPos}
                y={pixiScreen.height * 0.5}
                scale={scale()}
                angle={angle()}
              />
            );
          }}
        </For>
      </PixiCanvas>
      <Controls
        scale={scale()}
        angle={angle()}
        numSquares={numSquares()}
        onScaleChanged={setScale}
        onAngleChanged={setAngle}
        onNumSquaresChanged={setNumSquares}
      />
    </div>
  );
};

export const Demo = (): JSX.Element => (
  <PixiApplicationProvider background="#2c2c2c">
    <DemoComponent />
  </PixiApplicationProvider>
);
`,u=t(`<h1>HTML and PixiJS`),d=t(`<p>This example demonstrates how to combine HTML elements with pixi-solid components and share state between them.`),f=t(`<p>HTML input controls update SolidJS signals, which then reactively update pixi-solid graphics in real-time.`),p=t(`<h2 id=demo>Demo`),m=t(`<h2 id=code-example>Code example`),h=t(`<span>`),g=n(()=>i(()=>import(`./html-and-pixi.demo-t8Hmy9UE.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])),{export:`Demo`},`src/demos/html-and-pixi.demo.tsx`);function _(){return e(a,{get children(){return e(o,{get children(){return[r(u),r(d),r(f),r(p),e(c,{title:`html-and-pixi`,get children(){return e(g,{get fallback(){return r(h)}})}}),r(m),e(s,{code:l,title:`html-and-pixi.demo.tsx`})]}})}})}export{_ as default};