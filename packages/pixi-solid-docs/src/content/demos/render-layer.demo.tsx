import { Container, PixiCanvas, RenderLayer, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { createMemo, Loading, Show } from "solid-js";

import birdAssetUrl from "@/assets/bird_05.png";
import eelAssetUrl from "@/assets/eel.png";
import runAssetUrl from "@/assets/run_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the textures arrive.
  const assetsReady = createMemo(async () => {
    await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
      { alias: "run", src: runAssetUrl },
      { alias: "eel", src: eelAssetUrl },
    ]);
    return true;
  });

  let birdRef: Pixi.Sprite | undefined;
  let characterRef: Pixi.Sprite | undefined;
  let eelRef: Pixi.Sprite | undefined;

  return (
    <Loading>
      <Show when={assetsReady()}>
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode={"cover"}>
          <Sprite texture={Assets.get("sky")} />
        </ObjectFitContainer>
        <Container x={pixiScreen.width * 0.5} y={pixiScreen.height * 0.5} scale={3}>
          <Sprite texture={Assets.get("bird")} ref={birdRef} anchor={0.5} x={-10} y={-20} />
          <Sprite texture={Assets.get("run")} ref={characterRef} anchor={0.5} />
        </Container>
        <Sprite
          texture={Assets.get("eel")}
          x={pixiScreen.width * 0.5}
          y={pixiScreen.height * 0.5}
          anchor={0.5}
          ref={(sprite) => {
            eelRef = sprite;
          }}
        />
        {/* Set a custom render order by arranging out scene objects in a different order in the RenderLayer */}
        <RenderLayer>
          <Container as={eelRef} />
          <Container as={characterRef} />
          <Container as={birdRef} />
        </RenderLayer>
      </Show>
    </Loading>
  );
};

export const Demo = () => (
  <Loading fallback={<div>Loading...</div>}>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </Loading>
);
