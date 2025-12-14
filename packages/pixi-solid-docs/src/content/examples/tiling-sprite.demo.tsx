import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { AnimatedSprite, PixiApplication, PixiCanvas, PixiStage, Sprite, TilingSprite, useTick } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const skyTexture = await Assets.load<Pixi.Texture>("/sky.png");
    const groundTexture = await Assets.load<Pixi.Texture>("/ground-tile.png");
    const runTextures = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    return { skyTexture, groundTexture, runTextures: Object.values(runTextures) };
  });
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(textures) => (
            <PixiStage>
              <Sprite texture={textures().skyTexture} position={{ x: 0, y: -50 }} scale={3.6} />
              <TilingSprite
                ref={(tileRef) => {
                  useTick((ticker) => {
                    tileRef.tilePosition.x -= 6 * ticker.deltaTime;
                  });
                }}
                texture={textures().groundTexture}
                width={800}
                height={200}
                tileScale={{ x: 5, y: 5 }}
                tilePosition={{ x: 0, y: 0 }}
                position={{ x: 0, y: 400 }}
              />
              <AnimatedSprite
                ref={(animatedSprite) => {
                  animatedSprite.play();
                }}
                textures={textures().runTextures}
                scale={4}
                animationSpeed={0.25}
                anchor={{ x: 0.5, y: 0.5 }}
                position={{ x: 350, y: 300 }}
              />
            </PixiStage>
          )}
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
