import { PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";

export const DemoApp = () => {
  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
      <Sprite texture={Texture.WHITE} x={100} y={100} scale={50} tint="#ff0000" />
    </PixiCanvas>
  );
};
