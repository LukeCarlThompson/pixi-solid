import { NineSliceSprite, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/nine-slice.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [sprite, setSprite] = createSignal<Pixi.NineSliceSprite>();

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    const instance = sprite();
    if (!instance) return;

    cumulativeDeltaTime += ticker.deltaTime;

    // Change the width and height to show dynamic scaling with stable corner scale
    instance.width =
      (Math.abs(Math.sin(cumulativeDeltaTime * 0.01)) * 0.8 + 0.2) * pixiScreen.width;
    instance.height =
      (Math.abs(Math.sin(cumulativeDeltaTime * 0.003)) * 0.8 + 0.2) * pixiScreen.height;
  });

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
        ref={setSprite}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="pink">
    <DemoComponent />
  </PixiCanvas>
);
