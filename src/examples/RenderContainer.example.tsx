import { Texture } from "pixi.js";
import { RenderContainer, Sprite } from "pixi-solid";

export const MyRenderContainerComponent = () => {
  return (
    <RenderContainer>
      <Sprite texture={Texture.from("path/to/your/image.png")} />
    </RenderContainer>
  );
};
