import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { Sprite } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const Sky = () => {
  const [textureResource] = createResource(async () => {
    const texture = await Assets.load<Pixi.Texture>("/sky.png");

    // Setting scale mode to nearest for crisp pixel art
    texture.source.scaleMode = "nearest";

    return texture;
  });
  return (
    <Show when={textureResource()}>
      {(texture) => <Sprite texture={texture()} position={{ x: 0, y: -50 }} scale={3.6} />}
    </Show>
  );
};
