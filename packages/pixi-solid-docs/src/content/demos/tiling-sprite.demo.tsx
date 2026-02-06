import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { onTick, PixiApplication, PixiCanvas, TilingSprite, usePixiScreen } from "pixi-solid";
import { createResource, Show } from "solid-js";
import assetUrl from "@/assets/ground-tile.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    const groundTexture = await Assets.load<Pixi.Texture>(assetUrl);

    return groundTexture;
  });
  return (
    <Show when={textureResource()}>
      {(texture) => (
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
      )}
    </Show>
  );
};

export const Demo = () => (
  <PixiApplication background="#1099bb">
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </PixiApplication>
);
