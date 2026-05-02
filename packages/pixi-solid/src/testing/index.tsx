import type { JSX } from "solid-js";
import { children, createRoot } from "solid-js";
import { afterEach } from "vitest";

const activeDisposers = new Set<() => void>();

afterEach(() => {
  const errors: unknown[] = [];

  for (const dispose of activeDisposers) {
    try {
      dispose();
    } catch (error) {
      errors.push(error);
    }
  }

  if (errors.length === 1) {
    throw errors[0];
  }

  if (errors.length > 1) {
    throw new AggregateError(errors, `${errors.length} disposers threw during test cleanup.`);
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

const createTrackedRoot = <T,>(setup: () => T): { value: T; dispose: () => void } => {
  let disposeRoot: (() => void) | undefined;
  const dispose = trackDisposer(() => {
    disposeRoot?.();
  });

  try {
    const value = createRoot((nextDisposeRoot) => {
      disposeRoot = nextDisposeRoot;
      return setup();
    });

    return { value, dispose };
  } catch (setupError) {
    try {
      dispose();
    } catch (cleanupError) {
      throw new AggregateError(
        [setupError, cleanupError],
        "Root setup threw and cleanup also failed.",
      );
    }

    throw setupError;
  }
};

export const withTestRoot = <T,>(setup: () => T): { value: T; dispose: () => void } => {
  return createTrackedRoot(setup);
};

/**
 * Calls pixi solid components in a pure Solid root without mounting to the Canvas.
 */
export const mountHeadless = (component: () => JSX.Element): (() => void) => {
  const { dispose } = createTrackedRoot(() => {
    const c = children(component);
    c();
  });

  return dispose;
};
