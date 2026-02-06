import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { Container, PixiApplication, PixiCanvas, RenderLayer, Sprite, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type { JSX } from "solid-js";
import { createResource, onCleanup, Show, Suspense } from "solid-js";
import birdAssetUrl from "@/assets/bird_05.png";
import eelAssetUrl from "@/assets/eel.png";
import runAssetUrl from "@/assets/run_03.png";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Create a resource to load the sky texture
  const [textureResource] = createResource(() =>
    Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird", src: birdAssetUrl },
      { alias: "run", src: runAssetUrl },
      { alias: "eel", src: eelAssetUrl },
    ]),
  );

  let birdRef: (Pixi.Sprite & JSX.Element) | undefined;
  let runRef: (Pixi.Sprite & JSX.Element) | undefined;
  let eelRef: (Pixi.Sprite & JSX.Element) | undefined;

  return (
    <Show when={textureResource()}>
      {/* Show our Stage when the assets are loaded */}
      <Sprite
        texture={Assets.get("sky")}
        ref={(sprite) => {
          objectFit(sprite, pixiScreen, "cover");
        }}
      />
      <Container
        ref={(sprite) => {
          eelRef = sprite as Pixi.Sprite & JSX.Element;
        }}
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        scale={3}
      >
        <Sprite texture={Assets.get("bird")} ref={birdRef} anchor={0.5} x={-10} y={-20} />
        <Sprite texture={Assets.get("run")} ref={runRef} anchor={0.5} />
      </Container>
      <Sprite
        texture={Assets.get("eel")}
        ref={(sprite) => {
          eelRef = sprite as Pixi.Sprite & JSX.Element;
          objectFit(sprite, pixiScreen, "scale-down");
        }}
      />
      {/* Set a custom render order by arranging out scene objects in a different order in the RenderLayer */}
      <RenderLayer>
        {eelRef}
        {runRef}
        {birdRef}
      </RenderLayer>
    </Show>
  );
};

export const Demo = () => (
  <PixiApplication
    ref={(app) => {
      // @ts-expect-error
      globalThis.__PIXI_DEVTOOLS__ = {
        app,
      };
      onCleanup(() => {
        // @ts-expect-error
        globalThis.__PIXI_DEVTOOLS__ = undefined;
      });
    }}
  >
    <Suspense fallback={<div>Loading...</div>}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <DemoComponent />
      </PixiCanvas>
    </Suspense>
  </PixiApplication>
);
