import { BitmapFont } from "pixi.js";
import { BitmapText, onResize, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";

export const DemoApp = () => {
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
    <PixiApplication background={"#b3fffbff"}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <BitmapText
            text="Our cool custom bitmap font!"
            style={{
              fontFamily: "MyCustomBitmapFont",
              fontSize: 32,
              fill: 0xfff000,
              align: "center",
            }}
            ref={(text) => {
              // Position in the center of the screen
              onResize((screen) => {
                text.pivot.x = text.width * 0.5;
                text.pivot.y = text.height * 0.5;
                text.position.x = screen.width * 0.5;
                text.position.y = screen.height * 0.5;
              });
            }}
          />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
