import type * as Pixi from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Text } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";

export const DemoApp = () => {
  let textRef: Pixi.Text | undefined;

  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <Text
            text="Hello World"
            ref={textRef}
            style={{
              fill: "white",
              fontSize: 48,
              fontFamily: "Arial",
            }}
            onRender={(renderer) => {
              if (!textRef) return;
              objectFit(textRef, renderer.screen, "contain");
            }}
          />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
