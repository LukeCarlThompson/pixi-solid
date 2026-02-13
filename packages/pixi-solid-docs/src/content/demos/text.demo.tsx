import { PixiCanvas, Text } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";

const DemoComponent = () => {
  let textRef: Pixi.Text | undefined;

  return (
    <Text
      text="Hello World"
      ref={textRef}
      style={{
        fill: "white",
        fontSize: 68,
        fontFamily: "Arial",
      }}
      onRender={(renderer) => {
        if (!textRef) return;
        objectFit(textRef, renderer.screen, "contain");
      }}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
