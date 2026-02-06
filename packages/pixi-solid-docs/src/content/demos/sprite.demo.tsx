import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { PixiApplication, PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
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
          ref={(instance) => {
            objectFit(instance, pixiScreen, "cover");
          }}
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
