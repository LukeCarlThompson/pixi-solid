import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, RenderContainer, Sprite } from "pixi-solid";
import { createResource, Show, Suspense } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>("/sky.png"));
  return (
    <PixiApplication>
      <Suspense fallback={<div>Loading...</div>}>
        <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
          {/* Show our Stage when the assets are loaded */}
          <Show when={textureResource()}>
            {(texture) => (
              <PixiStage>
                <RenderContainer
                  render={(renderer) => {
                    renderer.clear({
                      clearColor: "pink",
                    });
                  }}
                >
                  <Sprite texture={texture()} />
                </RenderContainer>
              </PixiStage>
            )}
          </Show>
        </PixiCanvas>
      </Suspense>
    </PixiApplication>
  );
};
