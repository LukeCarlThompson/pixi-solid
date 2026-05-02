import type { JSX } from "solid-js";
import { children, createRoot } from "solid-js";
import { afterEach } from "vitest";

const activeDisposers = new Set<() => void>();

afterEach(() => {
  for (const dispose of activeDisposers) {
    dispose();
  }
});

const trackDisposer = (dispose: () => void): (() => void) => {
  const trackedDispose = () => {
    if (!activeDisposers.delete(trackedDispose)) return;
    dispose();
  };

  activeDisposers.add(trackedDispose);
  return trackedDispose;
};

export const withTestRoot = <T,>(setup: () => T): { value: T; dispose: () => void } => {
  let value!: T;
  const dispose = trackDisposer(
    createRoot((disposeRoot) => {
      value = setup();
      return disposeRoot;
    }),
  );

  return { value, dispose };
};

/**
 * Calls pixi solid components in a pure Solid root without mounting to the Canvas.
 */
export const mountHeadless = (component: () => JSX.Element): (() => void) => {
  const dispose = createRoot((disposeRoot) => {
    const c = children(component);
    c();

    return disposeRoot;
  });

  return trackDisposer(dispose);
};
