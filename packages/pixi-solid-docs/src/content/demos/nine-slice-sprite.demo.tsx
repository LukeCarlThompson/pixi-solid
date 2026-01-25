import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { getPixiApp, NineSliceSprite, onResize, onTick, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createResource, Show } from "solid-js";
import assetUrl from "@/assets/nine-slice.png";

export const DemoApp = () => {
  // Create a resource to load the nine slice texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>({ alias: "nine-slice", src: assetUrl }));

  return (
    <PixiApplication background="pink">
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <Show when={textureResource()}>
          <PixiStage>
            <NineSliceSprite
              texture={Assets.get("nine-slice")}
              // Add in the boundaries for scaling
              leftWidth={90}
              rightWidth={90}
              topHeight={90}
              bottomHeight={90}
              anchor={0.5}
              ref={(sprite) => {
                // Position the sprite in the center of the screen on resize
                onResize((screen) => {
                  sprite.position.x = screen.width * 0.5;
                  sprite.position.y = screen.height * 0.5;
                });

                const app = getPixiApp();

                let cumulativeDeltaTime = 0;

                onTick((ticker) => {
                  cumulativeDeltaTime += ticker.deltaTime;

                  // Change the width and height to show dynamic scaling with stable corner scale
                  sprite.width =
                    (Math.abs(Math.sin(cumulativeDeltaTime * 0.01)) * 0.8 + 0.2) * app.renderer.screen.width;
                  sprite.height =
                    (Math.abs(Math.sin(cumulativeDeltaTime * 0.003)) * 0.8 + 0.2) * app.renderer.screen.height;
                });
              }}
            />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
