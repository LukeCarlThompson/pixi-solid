import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { MeshPlane, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";
import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>({ alias: "sky", src: assetUrl }));
  return (
    <Show when={textureResource()}>
      <MeshPlane
        texture={Assets.get("sky")}
        verticesX={10}
        verticesY={10}
        ref={(mesh) => {
          // Position the mesh in the center of the screen
          mesh.pivot.y = 10;
          objectFit(mesh, { width: pixiScreen.width + 100, height: pixiScreen.height * 1.2 }, "cover");

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
    </Show>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
