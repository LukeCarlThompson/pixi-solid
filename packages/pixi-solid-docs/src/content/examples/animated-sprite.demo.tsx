import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { createResource, Show } from "solid-js";
import { RunningMan } from "./animated-sprite";
import { Sky } from "./sprite";

export const DemoApp = () => {
  const [texturesResource] = createResource(async () => {
    const assets = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    const textures = Object.values(assets);

    textures.forEach((texture) => {
      // Setting scale mode to nearest for crisp pixel art
      texture.source.scaleMode = "nearest";
    });

    return textures;
  });
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <Show when={texturesResource()}>
          <PixiStage>
            <Sky />
            <RunningMan />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
