import type * as Pixi3D from "@pixi/3d";
import { createRenderEffect, DEV, on, onCleanup } from "solid-js";

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
 * Whether a prop may be written to `key` on `target`.
 *
 * Options classes expose getter-only properties: `BatchedMesh3D.size` is fixed for the batch's
 * lifetime. Assigning to one throws, so the binder skips it.
 */
export const isWritableProp = (target: object, key: string): boolean => {
  for (let node: object | null = target; node; node = Object.getPrototypeOf(node)) {
    const descriptor = Object.getOwnPropertyDescriptor(node, key);
    if (descriptor) {
      return "value" in descriptor
        ? descriptor.writable === true
        : typeof descriptor.set === "function";
    }
  }
  return false;
};

/** Instances whose read-only props have already warned, so a reactive update warns once. */
const warnedInstances = new WeakMap<object, Set<string>>();

/**
 * Tells the developer that a prop they are updating cannot be written, instead of dropping the
 * update silently and leaving them to wonder why nothing changed.
 */
const warnReadOnlyProp = (instance: object, key: string): void => {
  if (!DEV) return;

  let warned = warnedInstances.get(instance);
  if (!warned) {
    warned = new Set();
    warnedInstances.set(instance, warned);
  }
  if (warned.has(key)) return;
  warned.add(key);

  const name = instance.constructor?.name ?? "instance";
  console.warn(
    `[pixi-solid-3d] ${name} "${key}" is read-only, so the new value is ignored. Build a new instance, for example by changing the \`key\` you mount it with.`,
  );
};

/** Writes a prop, or warns when the property has no setter. */
const assignProp = (instance: any, key: string, value: unknown): void => {
  if (!(key in instance)) return;
  if (!isWritableProp(instance, key)) {
    warnReadOnlyProp(instance, key);
    return;
  }
  if (key === "color" && instance.color?.setValue) {
    instance.color.setValue(value);
    return;
  }
  instance[key] = value;
};

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
        createRenderEffect(() => assignProp(instance, key, props[key]));
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

          assignProp(instance, key, nextValue);
        },
        { defer: true },
      ),
    );
  }
};
