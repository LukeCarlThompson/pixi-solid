import { AnimatedSprite, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl_01 from "@/assets/run_01.png";
import assetUrl_02 from "@/assets/run_02.png";
import assetUrl_03 from "@/assets/run_03.png";
import assetUrl_04 from "@/assets/run_04.png";
import assetUrl_05 from "@/assets/run_05.png";
import assetUrl_06 from "@/assets/run_06.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the textures arrive.
  const textures = createMemo(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const runTextures = await Assets.load<Pixi.Texture>([
      assetUrl_01,
      assetUrl_02,
      assetUrl_03,
      assetUrl_04,
      assetUrl_05,
      assetUrl_06,
    ]);

    return Object.values(runTextures);
  });

  return (
    <Loading>
      <AnimatedSprite
        autoPlay={true}
        textures={textures()}
        scale={3}
        animationSpeed={0.25}
        anchor={0.5}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} antialias={true}>
    <DemoComponent />
  </PixiCanvas>
);
