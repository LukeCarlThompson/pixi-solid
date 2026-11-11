import { createRenderEffect } from "solid-js";

type PropRecord = Record<string, unknown>;
type BindKey = (key: string, value: unknown) => void;

/**
 * Alternative prop binders for `bind-props-strategies.bench.ts`.
 *
 * The shipped binder creates one render effect per prop key. These render the
 * same props from a single effect, which is the shape Solid's own `spread` uses.
 *
 * An effect's apply callback is strict-read, so a single-effect binder captures
 * the values during the compute instead. Both capture into a reused array, so
 * neither pays a per-change allocation and the comparison isolates the number of
 * effects rather than garbage.
 */

/** Reads every included prop, then applies every one of them. */
export const bindSingleEffectRewrite = (
  props: PropRecord,
  include: (key: string) => boolean,
  bindKey: BindKey,
): void => {
  const keys = Object.keys(props).filter(include);
  const length = keys.length;
  const values: unknown[] = keys.map(() => undefined);

  createRenderEffect(
    () => {
      for (let i = 0; i < length; i += 1) {
        const key = keys[i];
        if (key !== undefined) values[i] = props[key];
      }
    },
    () => {
      for (let i = 0; i < length; i += 1) {
        const key = keys[i];
        if (key !== undefined) bindKey(key, values[i]);
      }
    },
  );
};

/** Reads every included prop, then applies only the ones whose value changed. */
export const bindSingleEffectDiff = (
  props: PropRecord,
  include: (key: string) => boolean,
  bindKey: BindKey,
): void => {
  const keys = Object.keys(props).filter(include);
  const length = keys.length;
  const next: unknown[] = keys.map(() => undefined);
  const previous: unknown[] = keys.map(() => undefined);
  let primed = false;

  createRenderEffect(
    () => {
      for (let i = 0; i < length; i += 1) {
        const key = keys[i];
        if (key !== undefined) next[i] = props[key];
      }
    },
    () => {
      for (let i = 0; i < length; i += 1) {
        if (primed && Object.is(previous[i], next[i])) continue;

        const key = keys[i];
        if (key === undefined) continue;

        bindKey(key, next[i]);
        previous[i] = next[i];
      }
      primed = true;
    },
  );
};
