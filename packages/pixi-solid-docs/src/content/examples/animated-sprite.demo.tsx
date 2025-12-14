import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { AnimatedSprite, PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const skyTexture = await Assets.load<Pixi.Texture>("/sky.png");
    const runTextures = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    return { skyTexture, runTextures: Object.values(runTextures) };
  });

  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(textures) => (
            <PixiStage>
              <Sprite texture={textures().skyTexture} position={{ x: 0, y: -50 }} scale={3.6} />
              <AnimatedSprite
                autoPlay={true}
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
