import type * as Pixi from "pixi.js";
import { Texture } from "pixi.js";
import { PixiApplication, PixiCanvas, PixiStage, AnimatedSprite, useTick, usePixiApp } from "pixi-solid";
import type { ParentProps } from "solid-js";

const AnimatedSpriteExample = () => {
  let spriteRef: Pixi.AnimatedSprite | undefined;

  const textures = [Texture.WHITE, Texture.WHITE, Texture.WHITE];

  const app = usePixiApp();

  useTick(() => {
    if (!spriteRef) return;

    const { height, width } = app.renderer;

    spriteRef.position.set(width * 0.5, height * 0.5);
  });

  return (
    <AnimatedSprite
      textures={textures}
      ref={spriteRef}
      autoPlay={true}
      animationSpeed={0.1}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};

const DemoApp = (props: ParentProps) => {
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <PixiStage>{props.children}</PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};

export const Example = () => {
  return (
    <DemoApp>
      <AnimatedSpriteExample />
    </DemoApp>
  );
};
