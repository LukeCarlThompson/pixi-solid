import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { createResource, Show, Suspense } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>("/sky.png"));
  return (
    <PixiApplication background="#1099bb">
      <Suspense fallback={<div>Loading...</div>}>
        <PixiCanvas style={{ height: "600px" }}>
          {/* Show our Stage when the assets are loaded */}
          <Show when={textureResource()}>
            {(texture) => (
              <PixiStage>
                <Sprite texture={texture()} position={{ x: 0, y: -50 }} scale={3.6} />
              </PixiStage>
            )}
          </Show>
        </PixiCanvas>
      </Suspense>
    </PixiApplication>
  );
};
