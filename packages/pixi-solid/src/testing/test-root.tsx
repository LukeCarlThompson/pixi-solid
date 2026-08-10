import type { Accessor, JSX, ParentProps } from "solid-js";
import type * as Pixi from "pixi.js";
import { children, createMemo, createRoot, untrack } from "solid-js";

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

export type RenderHookOptions = {
  /**
   * Component to run the hook inside. Pass `ctx.Provider` from
   * `createTestContext()` to provide the mock Pixi contexts, or your own
   * provider component for custom context.
   */
  wrapper?: (props: ParentProps) => JSX.Element;
};

export type RenderHookResult<T> = {
  /**
   * Accessor returning the hook's current return value. If the hook reads
   * reactive values (e.g. a store property), `result` re-evaluates when they
   * change. For hooks that return a stable reactive object (stores, screen
   * dimensions), `result()` returns that object and reads on it track normally.
   */
  result: Accessor<T>;
  /**
   * Destroy the Solid root. Call this in your test cleanup to prevent
   * memory leaks, or wire up `cleanup()` in `afterEach`.
   */
  dispose: () => void;
};

// ---------------------------------------------------------------------------
// Internal: create a Solid root and return the value + dispose
// ---------------------------------------------------------------------------

const createRootWithCleanup = <T,>(setup: () => T): { value: T; dispose: () => void } => {
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
 * or `renderHook` — cleanup happens automatically after each test.
 */
export const cleanup = (): void => {
  for (const dispose of disposers) {
    dispose();
  }
  disposers.clear();
};

// ---------------------------------------------------------------------------
// renderHook — for hook/store tests
// ---------------------------------------------------------------------------

/**
 * Run a hook (or store factory) in a temporary Solid root and expose its
 * return value as a reactive accessor.
 *
 * This is the clean way to test stores or functions that contain hooks
 * requiring context:
 *
 * ```tsx
 * const ctx = createTestContext();
 *
 * const { result } = renderHook(() => usePixiScreen(), {
 *   wrapper: ctx.Provider,
 * });
 *
 * expect(result().width).toBe(800);
 * ctx.renderer.emitResize({ width: 1024 });
 * expect(result().width).toBe(1024);
 * ```
 *
 * The callback runs exactly once inside the wrapper, so side effects like
 * `onTick` are registered against a stable owner and cleaned up on dispose.
 * If the callback reads reactive values, `result` re-evaluates it when those
 * values change. Return stable reactive objects (stores, screen dimensions)
 * rather than deriving primitives inside the callback.
 */
export const renderHook = <T,>(
  callback: () => T,
  options?: RenderHookOptions,
): RenderHookResult<T> => {
  const { value, dispose: disposeRoot } = createRootWithCleanup(() => {
    const Wrapper = options?.wrapper;

    const result = createMemo<T>(() => {
      if (!Wrapper) {
        return callback();
      }

      // Evaluate the wrapper as a component tree so context providers
      // (e.g. `ctx.Provider`) propagate context to the callback, then run
      // the callback once inside it.
      let captured: T | undefined;
      children(() => (
        <Wrapper>
          {(() => {
            captured = callback();
            return null;
          })()}
        </Wrapper>
      ))();
      return captured as T;
    });

    // Evaluate eagerly so errors (e.g. missing context) surface when
    // `renderHook` is called, matching the previous `createTestRoot` behaviour.
    untrack(() => result());

    return result;
  });

  const dispose = () => {
    disposeRoot();
    disposers.delete(dispose);
  };
  disposers.add(dispose);

  return { result: value, dispose };
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


