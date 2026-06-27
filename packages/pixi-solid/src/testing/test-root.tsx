import type { JSX } from "solid-js";
import { children, createRoot } from "solid-js";

type MountResult<T = void> = {
  /**
   * The value returned by the setup function. For JSX renderers this is
   * the resolved children (typically a PixiJS scene node).
   */
  value: T;
  /**
   * Destroy the Solid root. Call this in your test cleanup to prevent
   * memory leaks.
   */
  dispose: () => void;
};

const createRootWithCleanup = <T,>(setup: () => T): MountResult<T> => {
  let disposeRoot: (() => void) | undefined;

  try {
    const value = createRoot((nextDisposeRoot) => {
      disposeRoot = nextDisposeRoot;
      return setup();
    });

    return {
      value,
      dispose: () => disposeRoot?.(),
    };
  } catch (setupError) {
    if (disposeRoot) {
      disposeRoot();
    }

    throw setupError;
  }
};

/**
 * Mount JSX or run Solid code in a temporary root, returning the result
 * and a dispose function for cleanup.
 *
 * Use this for rendering components, testing hooks, and error assertions.
 *
 * **For typed access to rendered JSX**, use refs (which always receive the
 * correct Pixi type):
 *
 * ```tsx
 * let container!: Pixi.Container;
 * const { dispose } = mountTest(() => (
 *   <Container ref={container} x={10} />
 * ));
 * expect(container.x).toBe(10);
 * dispose();
 * ```
 *
 * **`value`** is useful for hook results and error testing:
 *
 * ```tsx
 * const { value: screen } = mountTest(() => usePixiScreen());
 * expect(() => mountTest(() => usePixiScreen())).toThrow();
 * ```
 */
export const mountTest = <T,>(setup: () => T): MountResult<T> => {
  return createRootWithCleanup(() => {
    // Use children() to create a reactive memo so signal changes inside the
    // callback trigger proper re-evaluation and cleanup of old JSX nodes.
    // The type cast is safe: children() at runtime just calls the function
    // and returns whatever it returns — it doesn't validate JSX.Element.
    const resolved = children(setup as () => JSX.Element);
    return resolved() as T;
  });
};
