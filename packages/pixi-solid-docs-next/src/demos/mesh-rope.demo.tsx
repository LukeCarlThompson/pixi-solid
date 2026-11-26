import { MeshRope, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, Point } from "pixi.js";
import { createEffect, createMemo, createSignal, Loading } from "solid-js";

import assetUrl from "@/assets/eel.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  const [mesh, setMesh] = createSignal<Pixi.MeshRope>();

  // Create the points we will use for our mesh
  const points: Point[] = [];
  for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 50, 0));
  }

  // Fit the mesh whenever it mounts and whenever the screen changes size.
  createEffect(
    () => [mesh(), pixiScreen.width, pixiScreen.height] as const,
    ([instance, width, height]) => {
      if (!instance) return;
      objectFit(instance, { width, height }, "contain");
    },
  );

  let cumulativeDeltaTime = 0;

  onTick((ticker) => {
    cumulativeDeltaTime += ticker.deltaTime;

    // Update mesh points to create wave motion
    for (let i = 0; i < points.length; i++) {
      points[i].y = Math.sin(cumulativeDeltaTime * 0.1 + i) * 20;
      points[i].x = i * 50 + Math.cos(cumulativeDeltaTime * 0.1 + 1) * 10;
    }
  });

  return (
    <Loading>
      <MeshRope texture={texture()} points={points} ref={setMesh} />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
