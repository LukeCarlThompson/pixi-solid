import { PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  const texture = createMemo(() => Assets.load<Pixi.Texture>(skyAssetUrl));

  return (
    <Loading>
      <Sprite texture={texture()} x={pixiScreen.width / 2} y={pixiScreen.height / 2} anchor={0.5} />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
