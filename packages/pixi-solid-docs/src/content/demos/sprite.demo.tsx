import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createResource, Show } from "solid-js";

import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>(skyAssetUrl));

  return (
    <Show when={textureResource()}>
      {(texture) => (
        <Sprite
          texture={texture()}
          x={pixiScreen.width / 2}
          y={pixiScreen.height / 2}
          anchor={0.5}
        />
      )}
    </Show>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
