import type * as Pixi from "pixi.js";
import { Texture } from "pixi.js";
import { AnimatedSprite } from "pixi-solid";

export const MyAnimatedSpriteComponent = () => {
  let spriteRef: Pixi.AnimatedSprite | undefined;

  const textures = [
    Texture.from("path/to/your/image1.png"),
    Texture.from("path/to/your/image2.png"),
    Texture.from("path/to/your/image3.png"),
  ];

  const handlePointerDown = (e: Pixi.FederatedEvent) => {
    if (!spriteRef) return;
    spriteRef.play();
  };

  return (
    <AnimatedSprite
      textures={textures}
      ref={spriteRef}
      autoPlay={true}
      onpointerdown={handlePointerDown}
      animationSpeed={0.1}
      x={100}
      y={150}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};
