import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { AnimatedSprite, Container, Sprite, useTick } from "pixi-solid";
import type { Ref } from "solid-js";
import { splitProps } from "solid-js";

// Using the Pixi ContainerOptions type to allow passing through any ContainerOptions props as well as adding a ref type to forward the ref to an internal Container.
export type SkyProps = Pixi.ContainerOptions & {
  ref?: Ref<Pixi.Container>;
  flyingSpeed: number;
};

export const Sky = (props: SkyProps) => {
  const skyTexture = Assets.get<Pixi.Texture>("/sky.png");
  const birdTextures = Assets.get<Pixi.Texture>([
    "/bird_01.png",
    "/bird_02.png",
    "/bird_03.png",
    "/bird_04.png",
    "/bird_05.png",
    "/bird_06.png",
  ]);

  // Splitting out flyingSpeed so we pass only the valid Container props to our Container
  const [, containerProps] = splitProps(props, ["flyingSpeed"]);

  return (
    // Spread the containerProps to pass through all valid Container options and the ref
    <Container {...containerProps}>
      <Sprite texture={skyTexture} />
      <AnimatedSprite
        scale={0.5}
        textures={Object.values(birdTextures)}
        animationSpeed={0.4 * props.flyingSpeed}
        ref={(bird) => {
          bird.play();
          let time = 0;
          useTick((ticker) => {
            time = time + ticker.deltaTime * props.flyingSpeed;
            bird.position.x = Math.sin(time / 90) * 20 + 60;
            bird.position.y = Math.cos(time / 30) * 25 + 30;
          });
        }}
      />
    </Container>
  );
};
