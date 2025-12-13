import type * as Pixi from "pixi.js";
import { Assets, TextureStyle } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, Sprite } from "pixi-solid";
import { createResource, createSignal, For, Show } from "solid-js";
import { RunningMan } from "./animated-sprite";
import { Sky } from "./sprite";
import { Ground } from "./tiling-sprite";

export const DemoApp = () => {
  const [texturesResource] = createResource(async () => {
    Assets.init();
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";
    const assets = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    const textures = Object.values(assets);

    return textures;
  });

  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <Show when={texturesResource()}>
          <PixiStage>
            <Sky />
            <Ground />
            <RunningMan />
          </PixiStage>
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
