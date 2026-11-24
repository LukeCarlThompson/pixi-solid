import { onTick, PixiCanvas, TilingSprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/ground-tile.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the texture arrives.
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  return (
    <Loading>
      <TilingSprite
        ref={(tileRef) => {
          onTick((ticker) => {
            tileRef.tilePosition.x -= 2 * ticker.deltaTime;
          });
          tileRef.width = pixiScreen.width;
          tileRef.height = pixiScreen.height * 0.5;
          tileRef.position.y = pixiScreen.height * 0.5;
        }}
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
