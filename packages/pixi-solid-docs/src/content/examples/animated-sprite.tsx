import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { AnimatedSprite, usePixiApp, useTick } from "pixi-solid";
import { createEffect, createResource, Show } from "solid-js";

export const RunningMan = () => {
  let spriteRef: Pixi.AnimatedSprite | undefined;

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

  const app = usePixiApp();

  useTick((ticker) => {
    if (!spriteRef) return;

    const { height, width } = app.renderer;
    spriteRef.position.set(width * 0.5, height * 0.5);
  });

  createEffect(() => {
    if (!texturesResource()) return;
    spriteRef?.play();
  });

  return (
    <Show when={texturesResource()}>
      {(textures) => {
        return (
          <AnimatedSprite
            ref={spriteRef}
            textures={textures()}
            scale={4}
            animationSpeed={0.25}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        );
      }}
    </Show>
  );
};
