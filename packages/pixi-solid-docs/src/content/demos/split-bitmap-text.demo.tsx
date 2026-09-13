import { onTick, PixiCanvas, SplitBitmapText, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { BitmapFont } from "pixi.js";

const fontName = "SplitBitmapDemoFont";

BitmapFont.install({
  name: fontName,
  style: {
    fontFamily: "Arial",
    fontSize: 42,
    fill: "white",
  },
});

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  let splitTextRef: Pixi.SplitBitmapText | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    if (!splitTextRef) return;

    elapsed += ticker.deltaMS;
    splitTextRef.chars.forEach((character, index) => {
      character.y = Math.sin(elapsed * 0.004 + index * 0.45) * 12;
    });
  });

  return (
    <SplitBitmapText
      ref={(instance) => {
        splitTextRef = instance;
      }}
      text="Fast bitmap animation"
      style={{
        fontFamily: fontName,
        fontSize: 42,
        fill: "#fff4b3",
      }}
      charAnchor={{ x: 0.5, y: 1 }}
      x={20}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#4527a0">
    <DemoComponent />
  </PixiCanvas>
);
