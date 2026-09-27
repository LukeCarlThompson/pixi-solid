import { MeshPlane, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the texture arrives.
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));
  return (
    <Loading>
      <MeshPlane
        texture={texture()}
        verticesX={10}
        verticesY={10}
        ref={(mesh) => {
          // Position the mesh in the center of the screen
          mesh.pivot.y = 10;
          objectFit(
            mesh,
            { width: pixiScreen.width + 100, height: pixiScreen.height * 1.2 },
            "cover",
          );

          // Get the buffer for vertex positions.
          const { buffer } = mesh.geometry.getAttribute("aPosition");
          let cumulativeDeltaTime = 0;

          onTick((ticker) => {
            cumulativeDeltaTime += ticker.deltaTime;

            for (let i = 0; i < buffer.data.length; i++) {
              buffer.data[i] += Math.sin(cumulativeDeltaTime * 0.1 + i) * 0.2;
            }
            buffer.update();
          });
        }}
      />
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
