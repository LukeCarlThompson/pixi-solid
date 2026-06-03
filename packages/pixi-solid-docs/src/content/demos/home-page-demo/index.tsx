import { CRTFilter } from "pixi-filters";
import { Container, onTick, PixiCanvas, Sprite, usePixiScreen, TilingSprite } from "pixi-solid";
import { objectFit, ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets, BlurFilter, Rectangle } from "pixi.js";
import { createResource, onCleanup, Show } from "solid-js";

import { Character } from "./character";
import { Controls } from "./controls";
import { createPlayerStore } from "./player-store";
import { loadSceneAssets } from "./load-scene-assets";

const DemoScene = (props: { isRunning: boolean; direction: "left" | "right" }) => {
  const pixiScreen = usePixiScreen();
  const sceneBounds = new Rectangle(0, 0, 400, 400);

  const blurFilter = new BlurFilter({ strength: 8 });
  const crtFilter = new CRTFilter({
    curvature: 3,
    lineContrast: 0.1,
    vignetting: 0.1,
    noise: 0.04,
    noiseSize: 2,
  });

  onTick(({ deltaTime }) => {
    crtFilter.seed = Math.random() * 10;
    crtFilter.time += deltaTime * 0.3;
  });

  onCleanup(() => {
    blurFilter.destroy();
    crtFilter.destroy();
  });

  return (
    <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
      <Container filters={crtFilter} boundsArea={sceneBounds}>
        <Sprite
          label="Sky"
          texture={Assets.get<Pixi.Texture>("sky")}
          filters={blurFilter}
          ref={(ref) => {
            objectFit(ref, sceneBounds, "cover");
          }}
        />
        <TilingSprite
          label="Ground"
          width={sceneBounds.width}
          height={sceneBounds.height * 0.3}
          position={{ x: 0, y: sceneBounds.height * 0.7 }}
          ref={(tileRef) => {
            onTick(({ deltaTime }) => {
              const movementSpeed = props.isRunning ? 1.3 : 0;
              const directionMultiplier = props.direction === "left" ? 1 : -1;
              tileRef.tilePosition.x += movementSpeed * directionMultiplier * deltaTime;
            });
          }}
          texture={Assets.get<Pixi.Texture>("ground")}
        />
        <Character
          direction={props.direction}
          isRunning={props.isRunning}
          position={{ x: sceneBounds.width * 0.5, y: sceneBounds.height * 0.7 }}
        />
      </Container>
    </ObjectFitContainer>
  );
};

export const DemoApp = () => {
  const playerStore = createPlayerStore();
  const [textureResource] = createResource(loadSceneAssets);

  return (
    <div style={{ position: "relative" }}>
      <Controls
        isRunning={playerStore.state.isRunning}
        direction={playerStore.state.direction}
        onToggleDirectionClicked={playerStore.toggleDirection}
        onToggleRunningClicked={playerStore.toggleRunning}
      />
      <PixiCanvas
        style={{
          "aspect-ratio": "16/9",
          overflow: "hidden",
          "border-radius": "10px",
        }}
      >
        <Show when={textureResource()}>
          <DemoScene
            isRunning={playerStore.state.isRunning}
            direction={playerStore.state.direction}
          />
        </Show>
      </PixiCanvas>
    </div>
  );
};
