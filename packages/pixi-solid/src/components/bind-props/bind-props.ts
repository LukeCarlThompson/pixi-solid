import type * as Pixi from "pixi.js";
import { createRenderEffect, onCleanup, on } from "solid-js";

import type { ContainerProps } from "../component-factories";

import { bindChildrenToContainer, bindChildrenToRenderLayer } from "./bind-children";
import { isEventProperty } from "./is-event-property";
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
  createRenderEffect(() => {
    for (const key in props) {
      if (key === "as") continue;

      if (key === "ref") {
        (props[key] as unknown as (arg: any) => void)(instance);

        continue;
      } else if (key === "children") {
        if ("attach" in instance && "detach" in instance) {
          bindChildrenToRenderLayer(instance as unknown as Pixi.RenderLayer, props.children);
        } else {
          bindChildrenToContainer(instance, props.children);
        }

        continue;
      }

      if (isPointProperty(key)) {
        createRenderEffect(() => setPointProperty(instance, key, props[key]));

        continue;
      }

      if (isPointAxisProperty(key)) {
        createRenderEffect(() => setPointAxisProperty(instance, key, props[key]));
        continue;
      }

      if (isEventProperty(key)) {
        createRenderEffect(() => {
          const eventName = key.slice(2);
          const eventHandler = props[key];

          if (eventHandler) {
            instance.on(eventName, eventHandler as any);
            onCleanup(() => {
              instance.off(eventName, eventHandler as any);
            });
          }
        });

        continue;
      }

      if (key in instance) {
        createRenderEffect(() => ((instance as any)[key] = props[key]));
        continue;
      }
    }
  });
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
  createRenderEffect<boolean>((defer) => {
    for (const key in props) {
      if (isPointProperty(key)) {
        createRenderEffect(
          on(
            () => props[key],
            () => {
              return setPointProperty(instance, key, props[key]);
            },
            { defer },
          ),
        );

        continue;
      }

      if (key in instance) {
        createRenderEffect(
          on(
            () => props[key],
            () => {
              (instance as any)[key] = props[key];
            },
            { defer },
          ),
        );
      }
    }

    return false;
  }, true);

  /**
   * Do not throw an error here for invalid prop names because there are some initialisation props that are not available as public properties. We want to allow users to pass these props but not try to set them on the instance.
   */
};
