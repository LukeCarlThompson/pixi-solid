import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { onResize, onTick, PixiApplication, PixiCanvas, PixiStage, TilingSprite } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    const groundTexture = await Assets.load<Pixi.Texture>("/ground-tile.png");

    return groundTexture;
  });
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the texture is loaded */}
        <Show when={textureResource()}>
          {(texture) => (
            <PixiStage>
              <TilingSprite
                ref={(tileRef) => {
                  onTick((ticker) => {
                    tileRef.tilePosition.x -= 2 * ticker.deltaTime;
                  });
                  onResize((screen) => {
                    tileRef.width = screen.width;
                    tileRef.height = screen.height * 0.5;
                    tileRef.position.y = screen.height * 0.5;
                  });
                }}
                texture={texture()}
                tileScale={{ x: 3, y: 3 }}
              />
            </PixiStage>
          )}
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
