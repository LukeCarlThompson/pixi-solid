import type * as Pixi from "pixi.js";
import type { ContainerProps } from "../component-factories";
import { bindChildrenToContainer, bindChildrenToRenderLayer } from "./bind-children";
import { setProp } from "./set-prop";
import { createRenderEffect, on, getOwner, runWithOwner } from "solid-js";

/**
 * Applies the props to a Pixi instance with subscriptions to maintain reactivity.
 *
 * @param instance The Pixi instance we want to apply props to.
 * @param props The props object.
 * @param defer Defers the createRenderEffect so the props aren't set on the first run.
 * This is useful because setting initialisation props can have unintended side effects.
 * Notably in AnimatedSprite, if we set the textures property after instantiation it will stop the instance from playing.
 */
export const bindProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
  defer?: boolean,
) => {
  const owner = getOwner();

  for (const key in props) {
    if (key === "as") continue;

    if (key === "ref") {
      /**
       * Use queueMicrotask for ref callback to ensure it runs after all current render effects are complete.
       * The parent will have added this instance as a child so that `ref.parent` is available in the ref callback.
       * We use runWithOwner to preserve the reactive context so hooks and providers are accessible.
       */
      queueMicrotask(() => {
        runWithOwner(owner, () => {
          (props[key] as unknown as (arg: any) => void)(instance);
        });
      });
    } else if (key === "children") {
      if ("attach" in instance && "detach" in instance) {
        bindChildrenToRenderLayer(instance as unknown as Pixi.RenderLayer, props.children);
      } else {
        bindChildrenToContainer(instance, props.children);
      }
      continue;
    }

    if (defer) {
      createRenderEffect(
        on<OptionsType[keyof OptionsType], OptionsType[keyof OptionsType] | undefined>(
          () => props[key as keyof typeof props],
          (_input, _prevInput, prevValue) => {
            return setProp(instance, key, props[key as keyof typeof props], prevValue);
          },
          { defer },
        ),
      );
      continue;
    }

    createRenderEffect((prevValue) =>
      setProp(instance, key, props[key as keyof typeof props], prevValue),
    );
  }
};
