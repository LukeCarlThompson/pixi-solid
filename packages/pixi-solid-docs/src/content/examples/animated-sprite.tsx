import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { AnimatedSprite } from "pixi-solid";

export const RunningMan = (props: Pixi.ContainerOptions) => {
  const textures = Object.values(
    Assets.get<Pixi.Texture>(["/run_0.png", "/run_1.png", "/run_2.png", "/run_3.png", "/run_4.png", "/run_5.png"])
  );

  return (
    <AnimatedSprite
      ref={(animatedSprite) => {
        animatedSprite.play();
      }}
      textures={textures}
      scale={4}
      animationSpeed={0.25}
      anchor={{ x: 0.5, y: 0.5 }}
      position={{ x: 350, y: 300 }}
      {...props}
    />
  );
};
