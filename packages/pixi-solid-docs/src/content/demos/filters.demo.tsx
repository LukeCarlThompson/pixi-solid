import type { JSX } from "@solidjs/web";
import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, TextureStyle } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading, onCleanup, Show } from "solid-js";

import birdAssetUrl from "@/assets/bird_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Set scale mode for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the textures arrive.
  const assetsReady = createMemo(async () => {
    await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
    ]);
    return true;
  });

  // Create the filter using the Pixi class
  const blurFilter = new BlurFilter({ strength: 0 });

  // Assign a signal and use a createEffect to bind it to the Pixi class.
  const [blurAmount, setBlurAmount] = createSignal(1);
  createEffect(
    () => blurAmount(),
    (amount) => {
      blurFilter.strength = amount;
    },
  );

  // Any time we create Pixi classes directly we need to remember to destroy them when our component is cleaned up.
  onCleanup(() => {
    blurFilter.destroy();
  });

  // Listen to pointer and set the blur amoutn signal to demonstrate binding PixiJS classes with signals
  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 ||
      e.global.x > pixiScreen.width ||
      e.global.y < 0 ||
      e.global.y > pixiScreen.height;
    if (notInsideCanvas) return;

    const newBlurAmount = Math.min(Math.max((e.global.x / pixiScreen.width) * 10, 0), 10);
    setBlurAmount(newBlurAmount);
  };

  return (
    <Loading>
      <Show when={assetsReady()}>
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
          <Sprite
            label="sky"
            texture={Assets.get<Pixi.Texture>("sky")}
            filters={blurFilter}
            eventMode="static"
            onglobalpointermove={handlePointerMove}
          />
        </ObjectFitContainer>

        <Sprite
          label="bird"
          texture={Assets.get<Pixi.Texture>("bird")}
          scale={2}
          anchor={0.5}
          x={pixiScreen.width * 0.5}
          y={pixiScreen.height * 0.5}
        />
      </Show>
    </Loading>
  );
};

export const Demo = (): JSX.Element => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DemoComponent />
  </PixiCanvas>
);
