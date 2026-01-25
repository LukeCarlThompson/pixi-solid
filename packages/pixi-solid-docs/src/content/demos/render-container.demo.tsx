import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, RenderContainer, Sprite } from "pixi-solid";
import { createResource, Show, Suspense } from "solid-js";
import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(() => Assets.load<Pixi.Texture>(assetUrl));
  return (
    <Show when={textureResource()}>
      {/* Show our Stage when the assets are loaded */}
      {(texture) => (
        <RenderContainer
          render={(renderer) => {
            renderer.clear({
              clearColor: "pink",
            });
          }}
        >
          <Sprite texture={texture()} />
        </RenderContainer>
      )}
    </Show>
  );
};

export const Demo = () => (
  <PixiApplication>
    {/* Adding Suspense to wait for our component assets to load with a HTML loading fallback */}
    <Suspense fallback={<div>Loading...</div>}>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <DemoComponent />
        </PixiStage>
      </PixiCanvas>
    </Suspense>
  </PixiApplication>
);
