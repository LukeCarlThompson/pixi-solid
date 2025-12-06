import { Texture } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";

export const PixiApplicationExample = () => {
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <PixiStage>
          <Sprite texture={Texture.WHITE} x={120} y={80} />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
