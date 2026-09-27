import { runWithOwner } from "solid-js";

const applyRefValue = <T>(ref: unknown, value: T): void => {
  if (Array.isArray(ref)) {
    for (const entry of ref.flat(Infinity)) {
      if (typeof entry === "function") entry(value);
    }
    return;
  }

  if (typeof ref === "function") ref(value);
};

/**
 * Apply a Solid `Ref<T>` value to an element or Pixi instance.
 *
 * Mirrors Solid's DOM `ref` runtime (`@solidjs/web`'s `applyRef`): the value
 * may be a callback or a (nested) array of callbacks. `null`/`undefined`
 * entries are skipped. Non-callback values are ignored rather than thrown on,
 * because `Ref<T>` also admits a direct `T`.
 *
 * The callback runs **without an owner**, matching `@solidjs/web`. A ref
 * callback only captures or touches the instance. `onCleanup` inside one never
 * runs and `createEffect` inside one never disposes, so keep that work in
 * `onSettled` or in an effect in the component body.
 *
 * Reading a signal inside a ref callback does not re-run it. Move the read into
 * the compute function of a `createEffect` when the callback must track it.
 */
export const applyRef = <T>(ref: unknown, value: T): void => {
  runWithOwner(null, () => applyRefValue(ref, value));
};
