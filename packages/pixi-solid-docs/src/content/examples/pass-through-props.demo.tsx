import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Text, usePixiApp, useTick } from "pixi-solid";
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
    const speed = Math.min(Math.max((e.global.x / e.currentTarget.width) * 2, 0.1), 2);
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
                  const originalWidth = component.width / component.scale.x;
                  const originalHeight = component.height / component.scale.y;

                  if (originalWidth === 0 || originalHeight === 0) return;

                  const rendererWidth = app.renderer.width;
                  const rendererHeight = app.renderer.height;

                  const widthRatio = rendererWidth / originalWidth;
                  const heightRatio = rendererHeight / originalHeight;

                  component.scale.set(Math.max(widthRatio, heightRatio));

                  // Center the skyContainer
                  component.x = (rendererWidth - component.width) / 2;
                  component.y = (rendererHeight - component.height) / 2;
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
