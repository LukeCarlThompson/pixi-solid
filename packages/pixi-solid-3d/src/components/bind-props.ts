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
 * Writes `value` to `target[key]`, and leaves the target alone when the value is `undefined`.
 *
 * Passing the key and its value through one generic ties them together, so the compiler checks the
 * value against the property it lands on. Iterating a union of keys cannot do that: a write through
 * a union of keys takes the intersection of their value types, which is `never`.
 */
export const assignDefinedProp = <Target extends object, Key extends keyof Target>(
  target: Target,
  key: Key,
  value: Target[Key] | undefined,
): void => {
  if (value !== undefined) target[key] = value;
};

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

/** Applies one prop value to whichever shape a `Container3D` stores it in. */
const applyPropValue = (instance: any, key: string, value: unknown): void => {
  if (isVector3DProperty(key)) {
    setVector3DProperty(instance, key, value);
    return;
  }

  if (isAxis3DProperty(key)) {
    setAxis3DProperty(instance, key, value);
    return;
  }

  if (isTopLevelAxisProperty(key)) {
    instance[key] = value;
    return;
  }

  assignProp(instance, key, value);
};

/**
 * Binds runtime props to a Container3D instance with subscriptions to maintain reactivity.
 *
 * The outer effect re-runs when the props object itself changes, which is what a spread props
 * signal does: `<Container3D {...spread()} />` builds a new props object, so keys that were absent
 * at mount have to be enumerated again before they can be bound. Re-running disposes the inner
 * effects with it and rebuilds them, which is why each one tracks a single prop.
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

      createRenderEffect(() => applyPropValue(instance, key, props[key]));
    }
  });
};

/**
 * Binds initialisation props to a Container3D instance.
 *
 * The constructor already applied the values present at mount, so those are only re-applied when
 * they change. A later run of the outer effect means the props object was replaced, as a spread
 * props signal does, so keys that were absent at mount are applied straight away.
 */
export const bindInitialisationProps3D = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends Record<string, any>,
>(
  instance: InstanceType,
  props: OptionsType,
): void => {
  let isFirstRun = true;

  createRenderEffect(() => {
    for (const key in props) {
      if (key === "children") continue;

      createRenderEffect(
        on(
          () => props[key],
          (nextValue, prevValue) => {
            if (nextValue === prevValue) return;

            applyPropValue(instance, key, nextValue);
          },
          { defer: isFirstRun },
        ),
      );
    }

    isFirstRun = false;
  });
};
