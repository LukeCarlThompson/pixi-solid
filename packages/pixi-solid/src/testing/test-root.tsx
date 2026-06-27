import type { JSX } from "solid-js";
import type * as Pixi from "pixi.js";
import { children, createRoot } from "solid-js";

export type CreateTestRootResult<T> = {
  /**
   * The value returned by the setup function. For hook/store tests this is
   * the hook's return value (e.g. PixiScreenDimensions from usePixiScreen).
   */
  value: T;
  /**
   * Destroy the Solid root. Call this in your test cleanup to prevent
   * memory leaks, or wire up `cleanup()` in `afterEach`.
   */
  dispose: () => void;
};

export type MountSceneResult<TRoot = Pixi.Container> = {
  /**
   * The root PixiJS Container of the rendered scene graph.
   * Use this directly for assertions or pass it to query helpers
   * like `getByLabel` and `queryByLabel`.
   */
  container: TRoot;
  /**
   * Destroy the Solid root. Call this in your test cleanup to prevent
   * memory leaks, or wire up `cleanup()` in `afterEach`.
   */
  dispose: () => void;
};

// ---------------------------------------------------------------------------
// Internal: create a Solid root and return the value + dispose
// ---------------------------------------------------------------------------

const createRootWithCleanup = <T,>(setup: () => T): CreateTestRootResult<T> => {
  let disposeRoot: (() => void) | undefined;

  try {
    const value = createRoot((nextDisposeRoot) => {
      disposeRoot = nextDisposeRoot;
      return setup();
    });

    return { value, dispose: () => disposeRoot?.() };
  } catch (setupError) {
    if (disposeRoot) {
      disposeRoot();
    }
    throw setupError;
  }
};

// ---------------------------------------------------------------------------
// Global cleanup registry
// ---------------------------------------------------------------------------

const disposers = new Set<() => void>();

/**
 * Run all registered cleanup disposers and clear the registry.
 *
 * Wire this into your test framework's lifecycle:
 *
 * ```tsx
 * import { afterEach } from "vitest";
 * import { cleanup } from "pixi-solid/testing";
 *
 * afterEach(() => cleanup());
 * ```
 *
 * Once wired, you no longer need to track `dispose` from `mountScene`
 * or `createTestRoot` — cleanup happens automatically after each test.
 */
export const cleanup = (): void => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.clear();
};

// ---------------------------------------------------------------------------
// createTestRoot — for hook/store tests
// ---------------------------------------------------------------------------

/**
 * Run code in a temporary Solid root and return the result.
 *
 * This is a thin wrapper around SolidJS's `createRoot` that also
 * captures the return value. Use it for testing hooks and stores
 * that need to run inside a reactive context.
 *
 * Unlike `mountScene`, this does NOT resolve JSX — it runs the
 * callback directly in a root. Bring your own providers.
 *
 * @example
 * ```tsx
 * const ctx = createTestContext();
 *
 * const { value: screen } = createTestRoot(() => (
 *   <ctx.Provider>
 *     {usePixiScreen()}
 *   </ctx.Provider>
 * ));
 *
 * expect(screen.width).toBe(800);
 * ```
 */
export const createTestRoot = <T,>(setup: () => T): CreateTestRootResult<T> => {
  const result = createRootWithCleanup(setup);
  const dispose = () => {
    result.dispose();
    disposers.delete(dispose);
  };
  disposers.add(dispose);
  return { value: result.value, dispose };
};

// ---------------------------------------------------------------------------
// mountScene — for component tests
// ---------------------------------------------------------------------------

/**
 * Mount JSX in a temporary Solid root and return the root Container.
 *
 * Use this for testing component scene graphs. The returned `container`
 * is the root PixiJS node — query children with `getByLabel` or access
 * properties directly.
 *
 * For component types other than `Pixi.Container` (e.g. AnimatedSprite),
 * specify the type via the generic parameter:
 *
 * ```tsx
 * const { container } = mountScene<Pixi.AnimatedSprite>(() => (
 *   <AnimatedSprite textures={...} />
 * ));
 * container.playing;
 * ```
 *
 * @example
 * ```tsx
 * const { container } = mountScene(() => (
 *   <Container label="scene">
 *     <Sprite label="player" x={100} />
 *   </Container>
 * ));
 *
 * expect(container.x).toBe(0);
 * const player = getByLabel(container, "player");
 * expect(player.x).toBe(100);
 * ```
 */
export const mountScene = <TRoot = Pixi.Container>(
  setup: () => JSX.Element,
): MountSceneResult<TRoot> => {
  const result = createRootWithCleanup(() => {
    // Use children() to resolve the JSX tree into a concrete node.
    // This is necessary because Solid component functions may return
    // reactive wrappers (e.g. memos for conditional rendering) rather
    // than concrete DOM/PixiJS nodes. children() resolves through
    // these wrappers to return the actual rendered instance.
    const resolved = children(setup);
    return resolved();
  });

  const dispose = () => {
    result.dispose();
    disposers.delete(dispose);
  };
  disposers.add(dispose);

  return {
    container: result.value as unknown as TRoot,
    dispose,
  };
};


