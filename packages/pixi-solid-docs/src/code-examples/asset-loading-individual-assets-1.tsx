import { PixiCanvas, Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

export const IndividualAssetLoadingDemo = () => {
  // Load the texture once. Reading the memo suspends, so the boundary below holds the scene
  // until the texture arrives.
  const backgroundImage = createMemo(async () => {
    const texture = await Assets.load<Pixi.Texture>("/background.png");
    return texture;
  });

  return (
    <PixiCanvas>
      <Loading>
        <Sprite
          texture={backgroundImage()}
          anchor={0.5}
          position={{ x: 400, y: 300 }}
          scale={0.5}
        />
      </Loading>
    </PixiCanvas>
  );
};
