import type * as Pixi from "pixi.js";
import { Assets, Point } from "pixi.js";
import { MeshRope, onTick, PixiApplication, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";
import assetUrl from "@/assets/eel.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Create a resource to load the eel texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>({ alias: "eel", src: assetUrl }));

  // Create the points we will use for our mesh
  const points: Point[] = [];
  for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 50, 0));
  }

  return (
    <Show when={textureResource()}>
      <MeshRope
        texture={Assets.get("eel")}
        points={points}
        ref={(mesh) => {
          // Position the mesh contained in the center of the screen
          objectFit(mesh, { width: pixiScreen.width, height: pixiScreen.height }, "contain");

          let cumulativeDeltaTime = 0;

          onTick((ticker) => {
            cumulativeDeltaTime += ticker.deltaTime;

            // Update mesh points to create wave motion
            for (let i = 0; i < points.length; i++) {
              points[i].y = Math.sin(cumulativeDeltaTime * 0.1 + i) * 20;
              points[i].x = i * 50 + Math.cos(cumulativeDeltaTime * 0.1 + 1) * 10;
            }
          });
        }}
      />
    </Show>
  );
};

export const Demo = () => (
  <PixiApplication>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </PixiApplication>
);
