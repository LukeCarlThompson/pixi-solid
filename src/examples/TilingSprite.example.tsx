import { Texture } from "pixi.js";
import { TilingSprite } from "pixi-solid";

export const MyTilingSpriteComponent = () => {
  return (
    <TilingSprite
      texture={Texture.from("path/to/your/image.png")}
      width={800}
      height={600}
      tilePosition={{ x: 0, y: 0 }}
    />
  );
};
