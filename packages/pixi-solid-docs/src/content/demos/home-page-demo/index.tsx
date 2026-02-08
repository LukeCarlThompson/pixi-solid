import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, Rectangle } from "pixi.js";
import { CRTFilter } from "pixi-filters";
import { Container, getPixiApp, onTick, PixiCanvas, Sprite } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, onCleanup, Show } from "solid-js";
import { Character } from "./character";
import { Controls } from "./controls";
import { createAppStore } from "./create-app-store";
import { Ground } from "./ground";
import { loadSceneAssets } from "./load-scene-assets";

export const DemoApp = () => {
  const appStore = createAppStore();

  const [textureResource] = createResource(loadSceneAssets);
  const sceneBounds = new Rectangle(0, 0, 200 * 2, 133 * 2);
  const blurFilter = new BlurFilter({ strength: 8 });
  const crtFilter = new CRTFilter({
    curvature: 3,
    lineContrast: 0.1,
    vignetting: 0.1,
    noise: 0.04,
    noiseSize: 2,
  });

  onCleanup(() => {
    blurFilter.destroy();
    crtFilter.destroy();
  });

  return (
    <div style={{ position: "relative" }}>
      <Controls
        isRunning={appStore.state.isRunning}
        direction={appStore.state.direction}
        onToggleDirectionClicked={appStore.toggleDirection}
        onToggleRunningClicked={appStore.toggleRunning}
      />
      <PixiCanvas
        style={{
          "aspect-ratio": `${sceneBounds.width}/${sceneBounds.height}`,
          overflow: "hidden",
          "border-radius": "10px",
        }}
      >
        <Show when={textureResource()}>
          <Container
            filters={crtFilter}
            ref={(container) => {
              const app = getPixiApp();
              onTick((ticker) => {
                objectFit(container, app.renderer, "cover");
                crtFilter.seed = Math.random() * 10;
                crtFilter.time += ticker.deltaTime * 0.3;
              });
            }}
          >
            <Sprite
              label="Sky"
              texture={Assets.get<Pixi.Texture>("sky")}
              filters={blurFilter}
              ref={(ref) => {
                objectFit(ref, sceneBounds, "cover");
              }}
            />
            <Ground
              movementSpeed={appStore.state.isRunning ? 1.3 : 0}
              direction={appStore.state.direction}
              width={sceneBounds.width}
              height={sceneBounds.height * 0.3}
              position={{ x: 0, y: sceneBounds.height * 0.7 }}
            />
            <Character
              direction={appStore.state.direction}
              isRunning={appStore.state.isRunning}
              position={{ x: sceneBounds.width * 0.5, y: sceneBounds.height * 0.7 }}
            />
          </Container>
        </Show>
      </PixiCanvas>
    </div>
  );
};
