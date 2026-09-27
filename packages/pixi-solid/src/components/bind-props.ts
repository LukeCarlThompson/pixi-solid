import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import { $PROXY, createRenderEffect, getOwner, runWithOwner } from "solid-js";

import { applyRef } from "../apply-ref";

import { bindChildrenToContainer, bindChildrenToRenderLayer } from "./bind-children";
import { isEventProperty } from "./event-properties";
import type { ContainerProps } from "./factories";
import {
  isPointProperty,
  setPointProperty,
  isPointAxisProperty,
  setPointAxisProperty,
} from "./point-properties";

type PropRecord = Record<string, unknown>;
type PropKeyBinder = (key: string, value: unknown) => (() => void) | void;

const EMPTY_KEYS: ReadonlySet<string> = new Set();

const hasOwn = (props: PropRecord, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(props, key);

/**
 * Writes a prop that Pixi stores directly on the instance: point props go
 * through `setPointProperty` so their axes can be updated individually, and
 * anything else is assigned when the instance actually has that property.
 * Shared by the initialization and runtime binders, whose remaining steps are
 * disjoint (initialization props are never events, refs, or point axes).
 */
const assignInstanceProp = (instance: Pixi.Container, key: string, value: unknown): void => {
  if (isPointProperty(key)) {
    setPointProperty(instance, key, value);
    return;
  }

  if (key in instance) {
    (instance as any)[key] = value;
  }
};

/**
 * Creates one render effect per present prop key, so a value change re-runs only
 * that key's effect and allocates nothing.
 *
 * A single effect that reads every prop (the shape Solid's own `spread` uses)
 * would re-enumerate and re-read all props on every change; per-key effects keep
 * an update proportional to what changed.
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
const bindPropsByKey = (
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
 * Binds the runtime props that are supported by a Pixi instance.
 *
 * @param instance The Pixi instance to update.
 * @param props The component props object.
 * @param runtimeKeys Keys owned by the runtime binder, precomputed by component
 * factories. When omitted, every prop is treated as a runtime prop.
 */
export const bindRuntimeProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
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
    const children = () => propsRecord.children as JSX.Element;

    if ("attach" in instance && "detach" in instance) {
      bindChildrenToRenderLayer(instance as unknown as Pixi.RenderLayer, children);
    } else {
      bindChildrenToContainer(instance, children);
    }
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

      if (isEventProperty(key)) {
        if (typeof value !== "function") return;

        const eventName = key.slice(2);
        instance.on(eventName, value as any);
        return () => instance.off(eventName, value as any);
      }

      if (isPointAxisProperty(key)) {
        setPointAxisProperty(instance, key, value);
        return;
      }

      assignInstanceProp(instance, key, value);
    },
    false,
  );
};

/**
 * Binds initialization props to an instance after the constructor has received
 * their initial values. Keys present at mount are not re-applied until they
 * change; keys added later are applied immediately. Props that are removed
 * retain their last value on the Pixi instance.
 *
 * @param instance The Pixi instance to update.
 * @param props The component props object.
 * @param runtimeKeys Keys owned by `bindRuntimeProps`, precomputed by component
 * factories. When omitted, every prop is treated as an initialization prop.
 */
export const bindInitialisationProps = <
  InstanceType extends Pixi.Container,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
  runtimeKeys: ReadonlySet<string> = EMPTY_KEYS,
): void => {
  const propsRecord = props as PropRecord;
  const include = (key: string) => !runtimeKeys.has(key);

  bindPropsByKey(
    propsRecord,
    include,
    (key, value) => assignInstanceProp(instance, key, value),
    true,
  );
};
