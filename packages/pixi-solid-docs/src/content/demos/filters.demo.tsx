import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, TextureStyle } from "pixi.js";
import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import birdAssetUrl from "@/assets/bird_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Set scale mode for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const [textureResource] = createResource(() =>
    Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
    ]),
  );

  // Create the filter using the Pixi class
  const blurFilter = new BlurFilter({ strength: 0 });

  // Assign a signal and use a createEffect to bind it to the Pixi class.
  const [blurAmount, setBlurAmount] = createSignal(1);
  createEffect(() => {
    blurFilter.strength = blurAmount();
  });

  // Any time we create Pixi classes directly we need to remember to destroy them when our component is cleaned up.
  onCleanup(() => {
    blurFilter.destroy();
  });

  // Listen to pointer and set the blur amoutn signal to demonstrate binding PixiJS classes with signals
  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 ||
      e.global.x > e.currentTarget.width ||
      e.global.y < 0 ||
      e.global.y > e.currentTarget.height;
    if (notInsideCanvas) return;

    const newBlurAmount = Math.min(Math.max((e.global.x / e.currentTarget.width) * 10, 0), 10);
    setBlurAmount(newBlurAmount);
  };

  return (
    <Show when={textureResource()}>
      {/* Show our Stage when the assets are loaded */}
      <Sprite
        label="sky"
        texture={Assets.get<Pixi.Texture>("sky")}
        filters={blurFilter}
        eventMode="static"
        onglobalpointermove={handlePointerMove}
        ref={(instance) => {
          objectFit(instance, pixiScreen, "cover");
        }}
      />
      <Sprite
        label="bird"
        texture={Assets.get<Pixi.Texture>("bird")}
        scale={2}
        anchor={0.5}
        ref={(instance) => {
          instance.x = pixiScreen.width * 0.5;
          instance.y = pixiScreen.height * 0.5;
        }}
      />
    </Show>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DemoComponent />
  </PixiCanvas>
);
