import { PixiCanvas, Sprite, Text } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading, Show } from "solid-js";

export const AssetManifestLoadingDemo = () => {
  const assetsReady = createMemo(async () => {
    // 1. Register the manifest
    await Assets.init({
      manifest: "/assets-manifest.json",
    });

    // 2. Load the bundles this scene needs
    await Assets.loadBundle("game-assets");
    await Assets.loadBundle("ui-assets");

    // `Assets.init` and `loadBundle` resolve to void, so return true to open the gate.
    return true;
  });

  return (
    // The fallback is a DOM element, so the boundary sits outside the canvas. A `<Loading>`
    // inside `PixiCanvas` would add its fallback as a Pixi child.
    <Loading fallback={<p>Loading...</p>}>
      {/* `Show` supplies the read the boundary waits on, then renders once the assets are ready */}
      <Show when={assetsReady()}>
        <PixiCanvas>
          {/* Read assets by the alias the manifest defines */}
          <Sprite
            texture={Assets.get<Pixi.Texture>("background")}
            anchor={0.5}
            position={{ x: 400, y: 300 }}
            scale={0.8}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("player_idle")}
            anchor={0.5}
            position={{ x: 400, y: 300 }}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("coin")}
            anchor={0.5}
            position={{ x: 450, y: 250 }}
          />
          <Sprite
            texture={Assets.get<Pixi.Texture>("button_play")}
            anchor={0.5}
            position={{ x: 400, y: 450 }}
          />
          <Text
            text="Game Loaded!"
            style={{ fontFamily: "font_pixel", fontSize: 32, fill: 0xffffff }}
            position={{ x: 200, y: 50 }}
          />
        </PixiCanvas>
      </Show>
    </Loading>
  );
};
