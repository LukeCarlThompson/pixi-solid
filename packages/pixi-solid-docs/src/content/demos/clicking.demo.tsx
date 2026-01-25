import { DEG_TO_RAD } from "pixi.js";
import { Graphics, PixiApplication, PixiCanvas, PixiStage, Text, usePixiScreen } from "pixi-solid";
import { createSignal } from "solid-js";

const ClickingDemo = () => {
  const screen = usePixiScreen();
  const [numberOfClicks, setNumberOfClicks] = createSignal(0);
  const textValue = () => `Number of clicks: ${numberOfClicks()}`;

  const handleClick = () => {
    setNumberOfClicks((prev) => prev + 1);
  };

  return (
    <>
      <Text
        text={textValue()}
        style={{ fill: "#ffffff", align: "center" }}
        anchor={0.5}
        x={screen.width * 0.5}
        y={screen.height * 0.1}
      />
      <Graphics
        ref={(graphics) => {
          graphics.roundRect(-70, -30, 140, 60, 8).fill("#0099ff");
        }}
        eventMode={"static"}
        cursor={"pointer"}
        onclick={handleClick}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
      />
      <Text
        text={"Click me!"}
        style={{
          fill: "#ffffff",
          align: "center",
          fontSize: 18,
          padding: 5,
          dropShadow: {
            alpha: 0.5,
            blur: 2,
            distance: 2,
            angle: 90 * DEG_TO_RAD,
            color: "#000000",
          },
        }}
        anchor={0.5}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
      />
    </>
  );
};

export const DemoApp = () => {
  return (
    <PixiApplication antialias={true} resolution={window.devicePixelRatio}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <ClickingDemo />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
