import type * as Pixi from "pixi.js";
import { AnimatedSprite, Container } from "pixi-solid";
import { createEffect, Match, Switch, splitProps } from "solid-js";
import { getIdleAnimationTextures, getRunAnimationTextures } from "./get-animation-textures";

export type CharacterProps = Omit<Pixi.ContainerOptions, "children"> & {
  direction: "left" | "right";
  isRunning: boolean;
};

export const Character = (props: CharacterProps) => {
  const [, pixiProps] = splitProps(props, ["isRunning", "direction"]);

  return (
    <Container {...pixiProps} label={"Character"}>
      <Switch>
        <Match when={props.isRunning}>
          <AnimatedSprite
            autoPlay={props.isRunning}
            ref={(instance) => {
              createEffect(() => {
                if (props.isRunning) {
                  instance.play();
                } else {
                  instance.stop();
                }
              });
            }}
            textures={getRunAnimationTextures()}
            scale={{ x: props.direction === "left" ? -1 : 1, y: 1 }}
            animationSpeed={0.25}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </Match>
        <Match when={!props.isRunning}>
          <AnimatedSprite
            autoPlay={true}
            textures={getIdleAnimationTextures()}
            scale={{ x: props.direction === "left" ? -1 : 1, y: 1 }}
            animationSpeed={0.25}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </Match>
      </Switch>
    </Container>
  );
};
