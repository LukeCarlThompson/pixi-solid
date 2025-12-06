import { Texture } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";

export const PixiCanvasExample = () => {
  return (
    <PixiApplication>
      <PixiCanvas style={{ background: "#1099bb" }}>
        <PixiStage>
          <Sprite texture={Texture.WHITE} x={100} y={100} />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
