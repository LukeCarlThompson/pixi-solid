import { Container, Graphics, PixiCanvas, usePixiScreen } from "pixi-solid";
import type { ObjectFitMode, ObjectPosition } from "pixi-solid/utils";
import { ObjectFitContainer } from "pixi-solid/utils";
import type { JSX } from "solid-js";
import { createSignal } from "solid-js";
import { Rectangle } from "pixi.js";

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

export const DemoApp = (): JSX.Element => {
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
