import type * as Pixi3D from "@pixi/3d";
import type { JSX } from "@solidjs/web";
import { $PROXY, createRenderEffect, DEV, getOwner, runWithOwner } from "solid-js";

import { applyRef } from "../apply-ref";

import { bindChildrenToContainer3D } from "./bind-children";
import { is3DEventProperty } from "./event-properties";
import {
  isAxis3DProperty,
  isTopLevelAxisProperty,
  isVector3DProperty,
  setAxis3DProperty,
  setVector3DProperty,
} from "./vector-properties";

type PropRecord = Record<string, unknown>;
type PropKeyBinder = (key: string, value: unknown) => (() => void) | void;

const EMPTY_KEYS: ReadonlySet<string> = new Set();

const hasOwn = (props: PropRecord, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(props, key);

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

/**
 * Writes a prop that a `Container3D` stores directly on the instance.
 *
 * A vector or axis prop goes through its setter so one axis can be updated alone. Options the
 * constructor consumed may have no property on the instance (14 of `ParticleSystem3DOptions`, such
 * as `speed`); those did their job at construction, so there is nothing to write. A property that
 * exists but has no setter warns once instead of throwing.
 */
const assignInstanceProp = (instance: Pixi3D.Container3D, key: string, value: unknown): void => {
  if (isVector3DProperty(key)) {
    setVector3DProperty(instance, key, value);
    return;
  }

  if (isAxis3DProperty(key)) {
    setAxis3DProperty(instance, key, value);
    return;
  }

  if (isTopLevelAxisProperty(key)) {
    (instance as unknown as PropRecord)[key] = value;
    return;
  }

  if (!(key in instance)) return;

  if (!isWritableProp(instance, key)) {
    warnReadOnlyProp(instance, key);
    return;
  }

  const target = instance as unknown as Record<string, any>;
  if (key === "color" && target.color?.setValue) {
    target.color.setValue(value);
    return;
  }

  target[key] = value;
};

/**
 * Creates one render effect per present prop key, so a value change re-runs only
 * that key's effect and allocates nothing.
 *
 * A single effect that reads every prop (the shape Solid's own `spread` uses)
 * has to rewrite every prop it read, because an apply callback cannot read
 * reactive values and so re-applies what the compute captured. That makes a
 * sparse update cost the whole prop set.
 *
 * Key additions are handled by a separate reconcile effect that adds the missing
 * keys instead of rebuilding them. This matters for `merge()`/spread views:
 * enumerating their keys also tracks their values, so a naive rebuild would
 * recreate every effect on a value change. Removed keys keep their effect; it
 * skips binding while the key is absent (retaining the last value on the
 * instance) and resumes if the key returns.
 *
 * Solid 2 does not give effects created inside an effect's apply callback an
 * owner, so each is created under the owner that is already active at setup
 * (`getOwner()`) with `runWithOwner`. That owner is the component's, so the
 * effects live and die with the component.
 *
 * @param deferInitialRun Keys bound during the first reconcile pass are the ones
 * the constructor already received, so they are not written until they change.
 */
export const bindPropsByKey = (
  props: PropRecord,
  include: (key: string) => boolean,
  bindKey: PropKeyBinder,
  deferInitialRun: boolean,
): void => {
  // A plain props object (the JSX compiler's output) has a fixed key set, so
  // there is nothing to reconcile: create one owned effect per key directly.
  if (!($PROXY in props)) {
    for (const key in props) {
      if (!include(key)) continue;

      createRenderEffect(
        () => props[key],
        (value) => bindKey(key, value),
        deferInitialRun ? { defer: true } : undefined,
      );
    }

    return;
  }

  const owner = getOwner();
  const bound = new Set<string>();
  let isFirstRun = true;

  const addKey = (key: string) => {
    bound.add(key);

    const createEffect = () => {
      createRenderEffect(
        () => props[key],
        (value) => {
          // The key may have been removed; keep the instance's last value.
          if (!hasOwn(props, key)) return;

          return bindKey(key, value);
        },
        isFirstRun && deferInitialRun ? { defer: true } : undefined,
      );
    };

    // Effects created during the first pass run inside component setup, so they
    // already belong to the component owner. Only keys added later need the
    // owner restored explicitly.
    if (isFirstRun) createEffect();
    else runWithOwner(owner, createEffect);
  };

  createRenderEffect(
    () => {
      // Track the key set only. Reading a key's value here would make the
      // reconcile run on every value change.
      let keyCount = 0;
      for (const key in props) {
        if (include(key)) keyCount += 1;
      }
      return keyCount;
    },
    () => {
      for (const key in props) {
        if (!include(key)) continue;

        if (!bound.has(key)) addKey(key);
      }

      isFirstRun = false;
    },
  );
};

/**
 * Binds the runtime props that are supported by a `Container3D`.
 *
 * @param instance The instance to update.
 * @param props The component props object.
 * @param runtimeKeys Keys owned by the runtime binder, precomputed by component
 * factories. When omitted, every prop is treated as a runtime prop.
 */
export const bindRuntimeProps3D = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends Record<string, any>,
>(
  instance: InstanceType,
  props: OptionsType,
  runtimeKeys?: ReadonlySet<string>,
): void => {
  const propsRecord = props as PropRecord;
  const include = (key: string) => (runtimeKeys?.has(key) ?? true) && key !== "children";

  const supportsChildren = runtimeKeys ? runtimeKeys.has("children") : true;
  const hasChildrenProp = supportsChildren && hasOwn(propsRecord, "children");

  if (hasChildrenProp) {
    bindChildrenToContainer3D(instance, () => propsRecord.children as JSX.Element);
  }

  bindPropsByKey(
    propsRecord,
    include,
    (key, value) => {
      if (key === "as") return;

      if (key === "ref") {
        applyRef(value, instance);
        return;
      }

      if (is3DEventProperty(key)) {
        if (typeof value !== "function") return;

        const eventName = key.slice(2);
        instance.on(eventName, value as any);
        return () => instance.off(eventName, value as any);
      }

      assignInstanceProp(instance, key, value);
    },
    false,
  );
};

/**
 * Binds initialisation props to an instance after the constructor has received
 * their initial values. Keys present at mount are not re-applied until they
 * change; keys added later are applied immediately. Props that are removed
 * retain their last value on the instance.
 *
 * @param instance The instance to update.
 * @param props The component props object.
 * @param runtimeKeys Keys owned by `bindRuntimeProps3D`, precomputed by component
 * factories. When omitted, every prop is treated as an initialisation prop.
 * @param options.deferInitialRun Skip the initial apply because the constructor
 * already received the values. Pass `false` when the caller supplied the
 * instance through `as`, because then the constructor never saw them.
 */
export const bindInitialisationProps3D = <
  InstanceType extends Pixi3D.Container3D,
  OptionsType extends Record<string, any>,
>(
  instance: InstanceType,
  props: OptionsType,
  runtimeKeys: ReadonlySet<string> = EMPTY_KEYS,
  options: { deferInitialRun?: boolean } = {},
): void => {
  const include = (key: string) => !runtimeKeys.has(key);

  bindPropsByKey(
    props as PropRecord,
    include,
    (key, value) => assignInstanceProp(instance, key, value),
    options.deferInitialRun ?? true,
  );
};
