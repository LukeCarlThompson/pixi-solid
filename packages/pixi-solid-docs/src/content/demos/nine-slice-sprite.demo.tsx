import { getPixiApp, NineSliceSprite, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createResource, Show } from "solid-js";

import assetUrl from "@/assets/nine-slice.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Create a resource to load the nine slice texture
  const [textureResource] = createResource(() =>
    Assets.load<Pixi.Texture>({ alias: "nine-slice", src: assetUrl }),
  );

  return (
    <Show when={textureResource()}>
      <NineSliceSprite
        texture={Assets.get("nine-slice")}
        // Add in the boundaries for scaling
        leftWidth={90}
        rightWidth={90}
        topHeight={90}
        bottomHeight={90}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        ref={(sprite) => {
          const app = getPixiApp();

          let cumulativeDeltaTime = 0;

          onTick((ticker) => {
            cumulativeDeltaTime += ticker.deltaTime;

            // Change the width and height to show dynamic scaling with stable corner scale
            sprite.width =
              (Math.abs(Math.sin(cumulativeDeltaTime * 0.01)) * 0.8 + 0.2) *
              app.renderer.screen.width;
            sprite.height =
              (Math.abs(Math.sin(cumulativeDeltaTime * 0.003)) * 0.8 + 0.2) *
              app.renderer.screen.height;
          });
        }}
      />
    </Show>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="pink">
    <DemoComponent />
  </PixiCanvas>
);
