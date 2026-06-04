import { Container, Graphics, PixiCanvas, usePixiScreen } from "pixi-solid";
import type { ObjectFitMode, ObjectPosition } from "pixi-solid/utils";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";
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

  createEffect(() => {
    if (!graphicsRef) return;
    objectFit(graphicsRef, bounds, props.fitMode, props.objectPosition);
  });

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
          objectFit(g, bounds, props.fitMode, props.objectPosition);
        }}
      />
    </Container>
  );
};

export const DemoApp = (): JSX.Element => {
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
