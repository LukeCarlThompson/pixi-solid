import type * as Pixi from "pixi.js";
import type { ContainerProps } from "./component-factories";
import { addChildren } from "./add-children";
import { setProp } from "./set-prop";
import { createRenderEffect, on } from "solid-js";

/**
 * Applies the props to a Pixi instance with subsriptions to maintain reactivity.
 *
 * @param instance The Pixi instance we want to apply props to.
 * @param props The props object.
 * @param defer Defers the createRenderEffect so the props aren't set on the first run.
 * This is useful because setting initialisation props can have unintended side effects.
 * Notibly in AnimatedSprite, if we set the textures roperty after instantiation it will stop the instance from playing.
 */
export const applyProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
  defer?: boolean,
) => {
  for (const key in props) {
    if (key === "as") continue;

    if (key === "ref") {
      (props[key] as unknown as (arg: any) => void)(instance);
    } else if (key === "children") {
      addChildren(instance, props.children);
      continue;
    }

    if (defer) {
      createRenderEffect(
        on<OptionsType[keyof OptionsType], OptionsType[keyof OptionsType] | undefined>(
          () => props[key as keyof typeof props],
          (_input, _prevInput, prevValue) => {
            const currentValue = props[key as keyof typeof props];
            setProp(instance, key, currentValue, prevValue);
            return currentValue;
          },
          { defer },
        ),
      );
      continue;
    }

    createRenderEffect<OptionsType[keyof OptionsType]>((prevValue) => {
      const currentValue = props[key as keyof typeof props];
      setProp(instance, key, currentValue, prevValue);
      return currentValue;
    });
  }
};
