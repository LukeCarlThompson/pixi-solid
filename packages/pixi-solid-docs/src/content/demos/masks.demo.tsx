import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { Graphics, PixiApplication, PixiCanvas, PixiStage, Sprite, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, onCleanup, Show } from "solid-js";
import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>([{ alias: "sky", src: skyAssetUrl }]));

  let graphicsRef: Pixi.Graphics | undefined;

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!graphicsRef) return;

    graphicsRef.position.set(e.screenX, e.screenY);
  };

  onCleanup(() => {
    if (graphicsRef) graphicsRef.destroy();
  });

  return (
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
            objectFit(instance, pixiScreen, "cover");
          }}
        />
      </PixiStage>
    </Show>
  );
};

export const Demo = () => (
  <PixiApplication>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <PixiStage>
        <DemoComponent />
      </PixiStage>
    </PixiCanvas>
  </PixiApplication>
);
