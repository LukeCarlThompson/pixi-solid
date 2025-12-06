import { Texture } from "pixi.js";
import { RenderLayer, Sprite } from "pixi-solid";

export const MyRenderLayerComponent = () => {
  // A RenderLayer can contain other objects.
  // It's used for advanced rendering effects.
  return (
    <RenderLayer>
      <Sprite texture={Texture.from("path/to/your/image.png")} />
    </RenderLayer>
  );
};
