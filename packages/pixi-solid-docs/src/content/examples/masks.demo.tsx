import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { Graphics, onResize, PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";
import skyAssetUrl from "@/assets/sky.png";

export const DemoApp = () => {
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>([{ alias: "sky", src: skyAssetUrl }]));

  let graphicsRef: Pixi.Graphics | undefined;

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!graphicsRef) return;

    graphicsRef.position.set(e.screenX, e.screenY);
  };

  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          <PixiStage onglobalpointermove={handlePointerMove} eventMode="static">
            <Graphics
              ref={(instance) => {
                graphicsRef = instance;
                instance.circle(0, 0, 100).fill(0x000000);
              }}
            />
            <Sprite
              label="sky"
              texture={Assets.get<Pixi.Texture>("sky")}
              mask={graphicsRef}
              ref={(instance) => {
                onResize((screen) => {
                  objectFit(instance, screen, "cover");
                });
              }}
            />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
