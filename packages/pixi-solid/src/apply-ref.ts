/**
 * Apply a Solid `Ref<T>` value to an element or Pixi instance.
 *
 * Mirrors Solid's DOM `ref` runtime (`@solidjs/web`'s `applyRef`): the value
 * may be a callback or a (nested) array of callbacks. `null`/`undefined`
 * entries are skipped. Non-callback values are ignored rather than thrown on,
 * because `Ref<T>` also admits a direct `T`.
 */
export const applyRef = <T>(ref: unknown, value: T): void => {
  if (Array.isArray(ref)) {
    for (const entry of ref.flat(Infinity)) {
      if (typeof entry === "function") entry(value);
    }
    return;
  }

  if (typeof ref === "function") ref(value);
};
