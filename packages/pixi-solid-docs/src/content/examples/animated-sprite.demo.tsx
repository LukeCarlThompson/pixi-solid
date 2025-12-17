import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { AnimatedSprite, onResize, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the required assets
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const runTextures = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    return Object.values(runTextures);
  });

  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(textures) => (
            <PixiStage>
              <AnimatedSprite
                autoPlay={true}
                textures={textures()}
                scale={3}
                animationSpeed={0.25}
                anchor={0.5}
                ref={(sprite) => {
                  // Position in the center of the screen
                  onResize((screen) => {
                    sprite.position.x = screen.width * 0.5;
                    sprite.position.y = screen.height * 0.5;
                  });
                }}
              />
            </PixiStage>
          )}
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
