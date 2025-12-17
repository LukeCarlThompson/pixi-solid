import type * as Pixi from "pixi.js";
import { Assets, Point } from "pixi.js";
import { MeshRope, onResize, onTick, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the eel texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>("/eel.png"));

  // Create the points we will use for our mesh
  const points: Point[] = [];
  for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 50, 0));
  }

  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <Show when={textureResource()}>
          <PixiStage>
            <MeshRope
              texture={Assets.get("/eel.png")}
              points={points}
              ref={(mesh) => {
                // Position the mesh contained in the center of the screen on resize
                onResize((screen) => {
                  objectFit(mesh, { width: screen.width, height: screen.height }, "contain");
                });

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
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
