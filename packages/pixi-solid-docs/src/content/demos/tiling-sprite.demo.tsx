import { onTick, PixiCanvas, TilingSprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/ground-tile.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  let tile: Pixi.TilingSprite | undefined;

  onTick((ticker) => {
    if (tile) tile.tilePosition.x -= 2 * ticker.deltaTime;
  });

  return (
    <Loading>
      <TilingSprite
        ref={(instance) => (tile = instance)}
        width={pixiScreen.width}
        height={pixiScreen.height * 0.5}
        position={{ x: 0, y: pixiScreen.height * 0.5 }}
        texture={texture()}
        tileScale={{ x: 3, y: 3 }}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
