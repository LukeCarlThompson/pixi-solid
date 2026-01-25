import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { onResize, PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";
import skyAssetUrl from "@/assets/sky.png";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>(skyAssetUrl));
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(texture) => (
            <PixiStage>
              <Sprite
                texture={texture()}
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
