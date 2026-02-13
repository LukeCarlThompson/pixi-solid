import { BitmapText, PixiCanvas, usePixiScreen } from "pixi-solid";
import { BitmapFont } from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Creating a bitmap version of a built in font instead of loading a custom one.
  BitmapFont.install({
    name: "MyCustomBitmapFont",
    resolution: 2,
    style: {
      fontFamily: "sans-serif",
      fontStyle: "italic",
      fontWeight: "bold",
      fontSize: 32,
      fill: "#9366cbff",
      dropShadow: {
        alpha: 0.5,
        blur: 2,
        distance: 1,
        angle: Math.PI * 0.5,
        color: "#000000",
      },
    },
  });

  return (
    <BitmapText
      text="Our cool custom bitmap font!"
      style={{
        fontFamily: "MyCustomBitmapFont",
        fontSize: 32,
        fill: 0xfff000,
        align: "center",
      }}
      anchor={0.5}
      x={pixiScreen.width * 0.5}
      y={pixiScreen.height * 0.5}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background={"#b3fffbff"}>
    <DemoComponent />
  </PixiCanvas>
);
