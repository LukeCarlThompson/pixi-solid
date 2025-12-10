import { Texture } from "pixi.js";
import { Sprite } from "pixi-solid";

export const MySpriteComponent = () => {
  return (
    <Sprite
      texture={Texture.from("path/to/your/image.png")}
      x={100}
      y={150}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};
