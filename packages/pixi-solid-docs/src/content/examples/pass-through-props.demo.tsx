import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { getPixiApp, onTick, PixiApplication, PixiCanvas, PixiStage, Text } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, createSignal, Show } from "solid-js";
import birdAssetUrl_01 from "@/assets/bird_01.png";
import birdAssetUrl_02 from "@/assets/bird_02.png";
import birdAssetUrl_03 from "@/assets/bird_03.png";
import birdAssetUrl_04 from "@/assets/bird_04.png";
import birdAssetUrl_05 from "@/assets/bird_05.png";
import birdAssetUrl_06 from "@/assets/bird_06.png";
import skyAssetUrl from "@/assets/sky.png";
import { Sky } from "./pass-through-props";

export const DemoApp = () => {
  const [flyingSpeed, setFlyingSpeed] = createSignal(1);

  const [texturesResource] = createResource(async () => {
    Assets.init();
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const assets = await Assets.load<Pixi.Texture>([
      { alias: "sky", src: skyAssetUrl },
      { alias: "bird_01", src: birdAssetUrl_01 },
      { alias: "bird_02", src: birdAssetUrl_02 },
      { alias: "bird_03", src: birdAssetUrl_03 },
      { alias: "bird_04", src: birdAssetUrl_04 },
      { alias: "bird_05", src: birdAssetUrl_05 },
      { alias: "bird_06", src: birdAssetUrl_06 },
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
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <Show when={texturesResource()}>
          <PixiStage onglobalpointermove={handlePointerMove} eventMode="static">
            {/* Here on our `Sky` custom component we can also set any valid ContainerOptions and they will be passed through to the underlying Container */}
            <Sky
              flyingSpeed={flyingSpeed()}
              tint={"#fff0a6"}
              ref={(component) => {
                const app = getPixiApp();
                onTick(() => {
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
