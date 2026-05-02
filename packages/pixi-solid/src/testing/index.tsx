import type { JSX } from "solid-js";
import { children, createRoot } from "solid-js";

export const withTestRoot = <T,>(setup: () => T): { value: T; dispose: () => void } => {
  let value!: T;
  const dispose = createRoot((disposeRoot) => {
    value = setup();
    return disposeRoot;
  });

  return { value, dispose };
};

/**
 * Calls pixi solid components in a pure Solid root without mounting to the Canvas.
 */
export const mountHeadless = (component: () => JSX.Element): (() => void) => {
  let disposeRoot: (() => void) | undefined;

  createRoot((dispose) => {
    disposeRoot = dispose;
    const c = children(component);
    c();
  });

  return () => disposeRoot?.();
};
