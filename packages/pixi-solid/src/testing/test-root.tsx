import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import type { ParentProps } from "solid-js";
import { children, createRenderEffect, createRoot, flush, resetErrorHalt } from "solid-js";

import { getAllByLabel, getByLabel, queryByLabel } from "./query-by-label";

type Wrapper = (props: ParentProps) => JSX.Element;

export type MountSceneOptions = {
  /**
   * Component that wraps the scene, typically `ctx.Provider` from
   * `createTestContext()`. Use it to provide Pixi application, ticker, or
   * screen context to the mounted scene.
   */
  wrapper?: Wrapper;
};

export type MountSceneResult<TRoot = Pixi.Container> = {
  /**
   * The root PixiJS Container of the rendered scene graph. Access properties
   * directly or use the bound query helpers below.
   */
  container: TRoot;
  /** Find a descendant by `label`. Throws if not found. */
  getByLabel: (label: string) => Pixi.Container;
  /** Find a descendant by `label`, or `undefined`. */
  queryByLabel: (label: string) => Pixi.Container | undefined;
  /** Find every descendant with `label`. */
  getAllByLabel: (label: string) => Pixi.Container[];
  /**
   * Destroy the Solid root and remove it from the `cleanup()` registry.
   * `cleanup()` in `afterEach` disposes it automatically, so calling this
   * directly is only needed to unmount mid-test.
   */
  dispose: () => void;
};

export type RenderHookOptions = {
  /**
   * Component to run the hook inside. Pass `ctx.Provider` from
   * `createTestContext()` to provide the mock Pixi contexts, or your own
   * provider component for custom context.
   */
  wrapper?: Wrapper;
};

export type RenderHookResult<T> = {
  /**
   * Accessor for the value returned by the hook callback. The callback runs
   * once; return a store or another accessor from it to observe updates.
   * Use `waitFor` when asserting on a value that changes over time.
   */
  result: () => T;
  /**
   * Destroy the Solid root and remove it from the `cleanup()` registry.
   * `cleanup()` in `afterEach` disposes it automatically, so calling this
   * directly is only needed to unmount mid-test.
   */
  dispose: () => void;
};

const createRootWithCleanup = <T,>(setup: () => T): { value: T; dispose: () => void } => {
  let disposeRoot: (() => void) | undefined;

  try {
    const value = createRoot((nextDisposeRoot) => {
      disposeRoot = nextDisposeRoot;
      return setup();
    });

    return { value, dispose: () => disposeRoot?.() };
  } catch (setupError) {
    disposeRoot?.();
    throw setupError;
  }
};

const disposers = new Set<() => void>();

/**
 * Render `content` inside an optional `wrapper` and keep the resulting
 * `children()` memo observed for the root's lifetime. Solid 2 auto-disposes a
 * `children()` memo once it has no subscribers, which would tear down the
 * component owners (and their Pixi instances) the tree created.
 *
 * Returns the resolved root node and a dispose function.
 */
const renderObserved = (
  wrapper: Wrapper | undefined,
  content: () => JSX.Element,
): { root: () => unknown; dispose: () => void } => {
  const Wrapped = wrapper;
  let node: unknown;

  const { dispose } = createRootWithCleanup(() => {
    const resolved = children(() => (Wrapped ? <Wrapped>{content()}</Wrapped> : content()));

    createRenderEffect(
      () => resolved(),
      (resolvedNode) => {
        node = resolvedNode;
      },
    );
  });

  return { root: () => node, dispose };
};

/**
 * Dispose every root registered by `mountScene` and `renderHook`, and clear
 * Solid's error halt. Wire it into the test framework's `afterEach`:
 *
 * ```ts
 * import { afterEach } from "vitest";
 * import { cleanup } from "pixi-solid/testing";
 *
 * afterEach(cleanup);
 * ```
 *
 * Solid 2 halts the whole reactive system after an uncaught error, which would
 * otherwise silently break every later test in the file. `cleanup` resets that
 * halt so a test that throws on purpose cannot poison its neighbours.
 */
export const cleanup = (): void => {
  for (const dispose of disposers) dispose();
  disposers.clear();
  resetErrorHalt();
};

const registerDisposer = (dispose: () => void): (() => void) => {
  const registered = () => {
    dispose();
    disposers.delete(registered);
  };
  disposers.add(registered);
  return registered;
};

/**
 * Run a hook (or store factory) once inside a temporary Solid root and expose
 * its return value as an accessor. Return a reactive accessor or store from
 * the callback to observe updates; use `waitFor` when asserting on those
 * updates. An optional `wrapper` provides context to the callback.
 *
 * Errors thrown while the hook runs surface synchronously from `renderHook`,
 * so missing-context tests can use a plain `expect(() => renderHook(...)).toThrow()`.
 */
export const renderHook = <T,>(
  callback: () => T,
  options?: RenderHookOptions,
): RenderHookResult<T> => {
  let result: T | undefined;
  let callbackRan = false;

  const HookRunner = (): null => {
    result = callback();
    callbackRan = true;
    return null;
  };

  const { dispose: disposeRoot } = renderObserved(options?.wrapper, () => <HookRunner />);

  flush();
  if (!callbackRan) {
    disposeRoot();
    throw new Error("renderHook: the wrapper must render its children");
  }

  return { result: () => result as T, dispose: registerDisposer(disposeRoot) };
};

/**
 * Mount a Pixi scene graph in a temporary Solid root and return its root node
 * with query helpers bound to it.
 *
 * Use `options.wrapper` (usually `ctx.Provider`) when the scene needs Pixi
 * context. The returned `container` is the root PixiJS node, so its properties
 * are accessible directly without a ref callback. For a root type other than
 * `Pixi.Container`, pass the type as a generic.
 *
 * @example
 * ```tsx
 * const { container, getByLabel, dispose } = mountScene(
 *   () => (
 *     <Container label="scene">
 *       <Sprite label="player" x={100} />
 *     </Container>
 *   ),
 * );
 *
 * expect(container.label).toBe("scene");
 * expect(getByLabel("player").x).toBe(100);
 * dispose();
 * ```
 */
export const mountScene = <TRoot = Pixi.Container,>(
  setup: () => JSX.Element,
  options?: MountSceneOptions,
): MountSceneResult<TRoot> => {
  const { root, dispose } = renderObserved(options?.wrapper, setup);

  flush();

  const container = root() as unknown as TRoot;

  return {
    container,
    getByLabel: (label) => getByLabel(container as unknown as Pixi.Container, label),
    queryByLabel: (label) => queryByLabel(container as unknown as Pixi.Container, label),
    getAllByLabel: (label) => getAllByLabel(container as unknown as Pixi.Container, label),
    dispose: registerDisposer(dispose),
  };
};
