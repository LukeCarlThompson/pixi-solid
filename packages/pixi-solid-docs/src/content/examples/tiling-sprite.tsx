import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { onTick, TilingSprite } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const Ground = () => {
  let tileRef: Pixi.TilingSprite | undefined;

  onTick((ticker) => {
    if (!tileRef) return;

    tileRef.tilePosition.x -= 6 * ticker.deltaTime;
  });
  const [textureResource] = createResource(async () => {
    const texture = await Assets.load<Pixi.Texture>("/ground-tile.png");

    // Setting scale mode to nearest for crisp pixel art
    texture.source.scaleMode = "nearest";

    return texture;
  });

  return (
    <Show when={textureResource()}>
      {(texture) => (
        <TilingSprite
          ref={tileRef}
          texture={texture()}
          width={800}
          height={200}
          tileScale={{ x: 5, y: 5 }}
          tilePosition={{ x: 0, y: 0 }}
          position={{ x: 0, y: 400 }}
        />
      )}
    </Show>
  );
};
