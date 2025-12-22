import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { AnimatedSprite, onResize, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createResource, Show } from "solid-js";
import assetUrl_01 from "@/assets/run_01.png";
import assetUrl_02 from "@/assets/run_02.png";
import assetUrl_03 from "@/assets/run_03.png";
import assetUrl_04 from "@/assets/run_04.png";
import assetUrl_05 from "@/assets/run_05.png";
import assetUrl_06 from "@/assets/run_06.png";

export const DemoApp = () => {
  // Create a resource to load the required assets
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const runTextures = await Assets.load<Pixi.Texture>([
      assetUrl_01,
      assetUrl_02,
      assetUrl_03,
      assetUrl_04,
      assetUrl_05,
      assetUrl_06,
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
