import { onTick, PixiCanvas, SplitText, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  let splitTextRef: Pixi.SplitText | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    if (!splitTextRef) return;

    elapsed += ticker.deltaMS;
    splitTextRef.chars.forEach((character, index) => {
      character.y = Math.sin(elapsed * 0.004 + index * 0.45) * 12;
    });
  });

  return (
    <SplitText
      ref={(instance) => {
        splitTextRef = instance;
      }}
      text="Animate every character"
      style={{
        fontFamily: "Arial",
        fontSize: 42,
        fill: "white",
        stroke: { color: "#263238", width: 4 },
      }}
      x={20}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
