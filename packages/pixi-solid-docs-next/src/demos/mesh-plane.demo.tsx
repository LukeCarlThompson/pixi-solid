import { MeshPlane, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [mesh, setMesh] = createSignal<Pixi.MeshPlane>();

  // Fit the mesh whenever it mounts and whenever the screen changes size.
  createEffect(
    () => [mesh(), pixiScreen.width, pixiScreen.height] as const,
    ([instance, width, height]) => {
      if (!instance) return;
      instance.pivot.y = 10;
      objectFit(instance, { width: width + 100, height: height * 1.2 }, "cover");
    },
  );

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    const instance = mesh();
    if (!instance) return;

    cumulativeDeltaTime += ticker.deltaTime;

    // Get the buffer for vertex positions.
    const { buffer } = instance.geometry.getAttribute("aPosition");

    for (let i = 0; i < buffer.data.length; i++) {
      buffer.data[i] += Math.sin(cumulativeDeltaTime * 0.1 + i) * 0.2;
    }
    buffer.update();
  });

  return (
    <Loading>
      <MeshPlane texture={texture()} verticesX={10} verticesY={10} ref={setMesh} />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
