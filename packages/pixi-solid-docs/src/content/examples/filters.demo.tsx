import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, NoiseFilter } from "pixi.js";
import { onResize, onTick, PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import skyAssetUrl from "@/assets/sky.png";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>(skyAssetUrl));

  // Create the filters using Pixi classes
  const noiseFilter = new NoiseFilter({ noise: 0.1, blendMode: "overlay" });
  // Change the seed every frame to make the noise dynamic
  onTick(() => {
    noiseFilter.seed = Math.random();
  });

  const blurFilter = new BlurFilter({ strength: 0 });

  // Assign a signal and use a createEffect to bind it to the Pixi class.
  const [blurAmount, setBlurAmount] = createSignal(1);
  createEffect(() => {
    blurFilter.strength = blurAmount();
  });

  // Any time we create Pixi classes directly we need to remember to destroy them when our component is cleaned up.
  onCleanup(() => {
    noiseFilter.destroy();
    blurFilter.destroy();
  });

  // Listen to pointer and set the blur amoutn signal to demonstrate binding PixiJS classes with signals
  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 || e.global.x > e.currentTarget.width || e.global.y < 0 || e.global.y > e.currentTarget.height;
    if (notInsideCanvas) return;

    const newBlurAmount = Math.min(Math.max((e.global.x / e.currentTarget.width) * 10, 0), 10);
    setBlurAmount(newBlurAmount);
  };

  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(texture) => (
            <PixiStage onglobalpointermove={handlePointerMove} eventMode="static">
              <Sprite
                texture={texture()}
                filters={[blurFilter, noiseFilter]}
                ref={(instance) => {
                  onResize((screen) => {
                    objectFit(instance, screen, "cover");
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
