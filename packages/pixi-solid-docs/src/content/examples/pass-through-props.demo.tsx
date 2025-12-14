import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Text, usePixiApp, useTick } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, createSignal, Show } from "solid-js";
import { Sky } from "./pass-through-props";

export const DemoApp = () => {
  const [flyingSpeed, setFlyingSpeed] = createSignal(1);

  const [texturesResource] = createResource(async () => {
    Assets.init();
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const assets = await Assets.load<Pixi.Texture>([
      "/sky.png",
      "/bird_01.png",
      "/bird_02.png",
      "/bird_03.png",
      "/bird_04.png",
      "/bird_05.png",
      "/bird_06.png",
    ]);

    return assets;
  });

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    const notInsideCanvas =
      e.global.x < 0 || e.global.x > e.currentTarget.width || e.global.y < 0 || e.global.y > e.currentTarget.height;
    if (notInsideCanvas) return;

    const speed = Math.min(Math.max((e.global.x / e.currentTarget.width) * 2, 0), 2);
    setFlyingSpeed(speed);
  };
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <Show when={texturesResource()}>
          <PixiStage onglobalpointermove={handlePointerMove} eventMode="static">
            {/* Here on our `Sky` custom component we can also set any valid ContainerOptions and they will be passed through to the underlying Container */}
            <Sky
              flyingSpeed={flyingSpeed()}
              tint={"#fff0a6"}
              ref={(component) => {
                const app = usePixiApp();
                useTick(() => {
                  objectFit(component, app.renderer, "cover");
                });
              }}
            />
            <Text
              text={`Flying Speed: ${flyingSpeed().toFixed(2)}`}
              position={{ x: 10, y: 10 }}
              style={{
                fill: "#ffffff",
                fontSize: 16,
              }}
            />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
