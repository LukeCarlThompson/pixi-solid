import type * as Pixi from "pixi.js";
import { createRenderEffect, on, getOwner, runWithOwner } from "solid-js";

import type { ContainerProps } from "../component-factories";

import { bindChildrenToContainer, bindChildrenToRenderLayer } from "./bind-children";
import { isEventProperty, setEventProperty } from "./set-event-property";
import {
  isPointProperty,
  setPointProperty,
  isPointAxisProperty,
  setPointAxisProperty,
} from "./set-point-property";

/**
 * Binds the props to a Pixi instance with subscriptions to maintain reactivity.
 *
 * This is specifically for the runtime props that can't be set at initialisation. These props will be set on the Pixi instance immediately after it is created but before rendering.
 *
 * @param instance The Pixi instance we want to bind the props to.
 * @param props The props object.
 */
export const bindRuntimeProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
): void => {
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

      continue;
    } else if (key === "children") {
      if ("attach" in instance && "detach" in instance) {
        bindChildrenToRenderLayer(instance as unknown as Pixi.RenderLayer, props.children);
      } else {
        bindChildrenToContainer(instance, props.children);
      }

      continue;
    }

    // TODO: Now that we check the prop names before creatign the effects can we have stricter typing on the props and avoid the need for type assertions in the setPointProperty and setEventProperty functions?
    if (isPointProperty(key)) {
      createRenderEffect(() => setPointProperty(instance, key, props[key]));

      continue;
    }

    if (isPointAxisProperty(key)) {
      createRenderEffect(() => setPointAxisProperty(instance, key, props[key]));
      continue;
    }

    if (isEventProperty(key)) {
      createRenderEffect((prevValue) => setEventProperty(instance, key, props[key], prevValue));

      continue;
    }

    if (key in instance) {
      createRenderEffect(() => ((instance as any)[key] = props[key]));
      continue;
    }

    throw new InvalidPropNameError(`Invalid prop name: ${key}`);
  }
};

/**
 * Binds the props to a Pixi instance with subscriptions to maintain reactivity.
 *
 * This is specifically for the initialisation props that can be set at the time of instance creation. These props will be passed into the Pixi class during instantiation but won't be set on the instance until they are changed again. This is to avoid side effects that can be caused by setting certain props after the instance is created, such as the AnimatedSprite's `textures` prop which stops the animation if it was already instantiated with `autoplay: true`.
 *
 * @param instance The Pixi instance we want to bind the props to.
 * @param props The props object.
 */
export const bindInitialisationProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
): void => {
  for (const key in props) {
    if (isPointProperty(key)) {
      createRenderEffect(
        on(
          () => props[key as keyof typeof props],
          () => {
            return setPointProperty(instance, key, props[key]);
          },
          { defer: true },
        ),
      );

      continue;
    }

    if (key in instance) {
      createRenderEffect(
        on(
          () => props[key as keyof typeof props],
          () => {
            (instance as any)[key] = props[key];
          },
          { defer: true },
        ),
      );

      continue;
    }

    throw new InvalidPropNameError(`Invalid prop name: ${key}`);
  }
};

export class InvalidPropNameError extends Error {
  constructor(reason?: string) {
    super(
      "Invalid pixi-solid prop name. Did you accidentally pass an invalid prop to a pixi-solid component?" +
        (reason ? ` Reason: ${reason}` : ""),
    );
    this.name = "InvalidPropNameError";
  }
}
