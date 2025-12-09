import { Texture } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";

export const PixiStageExample = () => {
  return (
    <PixiApplication>
      <PixiCanvas>
        <PixiStage>
          <Sprite texture={Texture.WHITE} x={50} y={50} />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
