import { NineSliceSprite, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/nine-slice.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the texture arrives.
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  return (
    <Loading>
      <NineSliceSprite
        texture={texture()}
        // Add in the boundaries for scaling
        leftWidth={90}
        rightWidth={90}
        topHeight={90}
        bottomHeight={90}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        ref={(sprite) => {
          let cumulativeDeltaTime = 0;

          onTick((ticker) => {
            cumulativeDeltaTime += ticker.deltaTime;

            // Change the width and height to show dynamic scaling with stable corner scale
            sprite.width =
              (Math.abs(Math.sin(cumulativeDeltaTime * 0.01)) * 0.8 + 0.2) * pixiScreen.width;
            sprite.height =
              (Math.abs(Math.sin(cumulativeDeltaTime * 0.003)) * 0.8 + 0.2) * pixiScreen.height;
          });
        }}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="pink">
    <DemoComponent />
  </PixiCanvas>
);
