import type { PixiComponentProps } from "pixi-solid";
import { AnimatedSprite, onTick, Container } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { splitProps } from "solid-js";

// Using the utility PixiComponentProps type to allow passing through any ContainerOptions props by default or accepts a generic for the specific Pixi component options we want to support.
export type BirdProps = Pick<PixiComponentProps, "position" | "x" | "y" | "angle" | "scale"> & {
  flyingSpeed: number;
};

export const Bird = (props: BirdProps) => {
  const birdTextures = Assets.get<Pixi.Texture>([
    "bird_01",
    "bird_02",
    "bird_03",
    "bird_04",
    "bird_05",
    "bird_06",
  ]);

  // Splitting out flyingSpeed so we pass only the valid Container props to our AnimatedSprite
  const [, containerProps] = splitProps(props, ["flyingSpeed"]);

  return (
    // Spread the containerProps to pass through all valid Container options and the ref
    <Container {...containerProps}>
      <AnimatedSprite
        textures={Object.values(birdTextures)}
        animationSpeed={0.4 * props.flyingSpeed}
        autoPlay={true}
        anchor={0.5}
        ref={(bird) => {
          let time = 0;
          onTick((ticker) => {
            time = time + ticker.deltaTime * props.flyingSpeed;
            bird.position.x = Math.sin(time / 90) * 20;
            bird.position.y = Math.cos(time / 30) * 25;
          });
        }}
      />
    </Container>
  );
};
