import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { MeshPlane, onResize, onTick, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";
import assetUrl from "@/assets/sky.png";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>({ alias: "sky", src: assetUrl }));
  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <Show when={textureResource()}>
          <PixiStage>
            <MeshPlane
              texture={Assets.get("sky")}
              verticesX={10}
              verticesY={10}
              ref={(mesh) => {
                // Position the mesh in the center of the screen on resize
                onResize((screen) => {
                  mesh.pivot.y = 10;
                  objectFit(mesh, { width: screen.width + 100, height: screen.height * 1.2 }, "cover");
                });

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
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
