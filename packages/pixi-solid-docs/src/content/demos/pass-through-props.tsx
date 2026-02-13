import type { PixiComponentProps } from "pixi-solid";
import { AnimatedSprite, Container, onTick, Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import type { Ref } from "solid-js";
import { splitProps } from "solid-js";

// Using the utility PixiComponentProps type to allow passing through any ContainerOptions props as well as adding a ref type to forward the ref to an internal Container.
export type SkyProps = PixiComponentProps & {
  ref?: Ref<Pixi.Container>;
  flyingSpeed: number;
};

export const Sky = (props: SkyProps) => {
  const skyTexture = Assets.get<Pixi.Texture>("sky");
  const birdTextures = Assets.get<Pixi.Texture>([
    "bird_01",
    "bird_02",
    "bird_03",
    "bird_04",
    "bird_05",
    "bird_06",
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
          onTick((ticker) => {
            time = time + ticker.deltaTime * props.flyingSpeed;
            bird.position.x = Math.sin(time / 90) * 20 + 60;
            bird.position.y = Math.cos(time / 30) * 25 + 30;
          });
        }}
      />
    </Container>
  );
};
