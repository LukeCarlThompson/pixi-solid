import { Texture } from "pixi.js";
import { NineSliceSprite } from "pixi-solid";

export const MyNineSliceSpriteComponent = () => {
  // Assumes a texture that is a 3x3 grid for slicing
  return (
    <NineSliceSprite
      texture={Texture.from("path/to/your/nine-slice-image.png")}
      leftWidth={20}
      topHeight={20}
      rightWidth={20}
      bottomHeight={20}
      width={200}
      height={100}
    />
  );
};
