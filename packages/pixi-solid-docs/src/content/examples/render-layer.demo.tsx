import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { Container, onResize, PixiApplication, PixiCanvas, PixiStage, RenderLayer, Sprite } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type { JSX } from "solid-js";
import { createResource, onCleanup, Show, Suspense } from "solid-js";

export const DemoApp = () => {
  // Setting scale mode to nearest for crisp pixel art
  TextureStyle.defaultOptions.scaleMode = "nearest";

  // Create a resource to load the sky texture
  const [textureResource] = createResource(() =>
    Assets.load<Pixi.Texture>(["/sky.png", "/bird_05.png", "/run_3.png", "/eel.png"])
  );

  let birdRef: (Pixi.Sprite & JSX.Element) | undefined;
  let runRef: (Pixi.Sprite & JSX.Element) | undefined;
  let eelRef: (Pixi.Sprite & JSX.Element) | undefined;

  return (
    <PixiApplication
      ref={(app) => {
        // @ts-expect-error
        globalThis.__PIXI_DEVTOOLS__ = {
          app,
        };
        onCleanup(() => {
          // @ts-expect-error
          globalThis.__PIXI_DEVTOOLS__ = undefined;
        });
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
          {/* Show our Stage when the assets are loaded */}
          <Show when={textureResource()}>
            <PixiStage>
              <Sprite
                texture={Assets.get("/sky.png")}
                ref={(sprite) => {
                  onResize((screen) => {
                    objectFit(sprite, screen, "cover");
                  });
                }}
              />
              <Container
                ref={(container) => {
                  onResize((screen) => {
                    objectFit(container, screen, "scale-down");
                  });
                }}
              >
                <Sprite texture={Assets.get("/bird_05.png")} ref={birdRef} position={{ x: -50, y: -60 }} scale={3} />
                <Sprite texture={Assets.get("/run_3.png")} ref={runRef} scale={3} />
              </Container>
              <Sprite
                texture={Assets.get("/eel.png")}
                ref={(sprite) => {
                  eelRef = sprite as Pixi.Sprite & JSX.Element;
                  onResize((screen) => {
                    objectFit(sprite, screen, "scale-down");
                  });
                }}
              />
              {/* Set a custom render order by arranging out scene objects in a different order in the RenderLayer */}
              <RenderLayer>
                {eelRef}
                {runRef}
                {birdRef}
              </RenderLayer>
            </PixiStage>
          </Show>
        </PixiCanvas>
      </Suspense>
    </PixiApplication>
  );
};
