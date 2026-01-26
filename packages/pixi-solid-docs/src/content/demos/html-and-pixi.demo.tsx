import { Graphics, PixiApplication, PixiCanvas, PixiStage, usePixiScreen } from "pixi-solid";
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
      oninput={(e) => props.onScaleChanged(parseFloat(e.currentTarget.value))}
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
      oninput={(e) => props.onAngleChanged(parseFloat(e.currentTarget.value))}
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
      oninput={(e) => props.onNumSquaresChanged(parseInt(e.currentTarget.value))}
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
        <PixiStage>
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
        </PixiStage>
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

export const Demo = () => (
  <PixiApplication background="#2c2c2c">
    <DemoComponent />
  </PixiApplication>
);
