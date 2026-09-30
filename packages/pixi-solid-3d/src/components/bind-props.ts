import type * as Pixi3D from "@pixi/3d";
import { createRenderEffect, on, onCleanup } from "solid-js";

import { bindChildrenToContainer3D } from "./bind-children";
import { is3DEventProperty } from "./event-properties";
import {
  isAxis3DProperty,
  isTopLevelAxisProperty,
  isVector3DProperty,
  setAxis3DProperty,
  setVector3DProperty,
} from "./vector-properties";

/**
 * Binds runtime props to a Container3D instance with subscriptions to maintain reactivity.
 */
export const bindRuntimeProps3D = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends Record<string, any>,
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
      }

      if (key === "children") {
        bindChildrenToContainer3D(instance, props.children);
        continue;
      }

      if (isVector3DProperty(key)) {
        createRenderEffect(() => setVector3DProperty(instance, key, props[key]));
        continue;
      }

      if (isAxis3DProperty(key)) {
        createRenderEffect(() => setAxis3DProperty(instance, key, props[key]));
        continue;
      }

      if (isTopLevelAxisProperty(key)) {
        createRenderEffect(() => {
          instance[key] = props[key];
        });
        continue;
      }

      if (is3DEventProperty(key)) {
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
        createRenderEffect(() => {
          if (key === "color" && (instance as any).color?.setValue) {
            (instance as any).color.setValue(props[key]);
            return;
          }
          (instance as any)[key] = props[key];
        });
        continue;
      }
    }
  });
};

/**
 * Binds initialisation props to a Container3D instance.
 * Updates properties only when they change after initial creation.
 */
export const bindInitialisationProps3D = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends Record<string, any>,
>(
  instance: InstanceType,
  props: OptionsType,
): void => {
  for (const key in props) {
    if (key === "children") continue;

    createRenderEffect(
      on(
        () => props[key],
        (nextValue, prevValue) => {
          if (nextValue === prevValue) return;

          if (isVector3DProperty(key)) {
            setVector3DProperty(instance, key, nextValue);
            return;
          }

          if (isAxis3DProperty(key)) {
            setAxis3DProperty(instance, key, nextValue);
            return;
          }

          if (isTopLevelAxisProperty(key)) {
            instance[key] = nextValue;
            return;
          }

          if (key === "color" && (instance as any).color?.setValue) {
            (instance as any).color.setValue(nextValue);
            return;
          }

          if (key in instance) {
            (instance as any)[key] = nextValue;
          }
        },
        { defer: true },
      ),
    );
  }
};
