import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { onResize, PerspectiveMesh, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the nine slice texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>("/ground.webp"));

  return (
    <PixiApplication background="transparent">
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <Show when={textureResource()}>
          <PixiStage>
            <PerspectiveMesh
              label="Ground"
              texture={Assets.get("/ground.webp")}
              verticesX={20}
              verticesY={20}
              x0={50}
              y0={20}
              x1={150}
              y1={20}
              x2={200}
              y2={60}
              x3={0}
              y3={60}
              ref={(component) => {
                onResize((screen) => {
                  objectFit(component, screen, "contain");
                });
              }}
            />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
