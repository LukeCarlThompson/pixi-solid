import type { JSX } from "@solidjs/web";
import { Container, Ticker } from "pixi.js";
import type * as Pixi from "pixi.js";
import type { ParentProps } from "solid-js";

import { PixiAppContext, ScreenStoreContext, TickerContext } from "../pixi-application";
import { createPixiScreenStore } from "../use-pixi-screen";

import type { ManualTicker } from "./manual-ticker";
import { createManualTicker } from "./manual-ticker";
import type { MountSceneResult, RenderHookResult } from "./test-root";
import { mountScene as createMountScene, renderHook as createRenderHook } from "./test-root";

export type TestRenderer = {
  screen: { width: number; height: number; x: number; y: number };
  addListener: (event: string, listener: () => void) => void;
  removeListener: (event: string, listener: () => void) => void;
  /** Dispatch a named event — fires all registered listeners. */
  emit: (event: string) => void;
  /** Update screen dimensions and emit "resize". */
  emitResize: (
    nextScreen?: Partial<{ width: number; height: number; x: number; y: number }>,
  ) => void;
};

export type TestContext = {
  /** Provider component that wraps children in mock Pixi contexts. */
  Provider: (props: ParentProps) => JSX.Element;
  /** Manually-controlled ticker for advancing frames in tests. */
  ticker: ManualTicker;
  /** Mock renderer for simulating resize events. */
  renderer: TestRenderer;
  /** Minimal Pixi.Application stub wired to `renderer`. */
  app: Pixi.Application;
  /**
   * Mount a scene wrapped in the mock `Provider`. Equivalent to
   * `mountScene(setup, { wrapper: Provider })`. Prefer this when the scene
   * needs Pixi context.
   */
  mount: <TRoot = Pixi.Container>(setup: () => JSX.Element) => MountSceneResult<TRoot>;
  /**
   * Run a hook (or store factory) inside the mock Pixi contexts and expose
   * its return value as a reactive accessor. Equivalent to
   * `renderHook(callback, { wrapper: Provider })`.
   */
  renderHook: <T>(callback: () => T) => RenderHookResult<T>;
};

/**
 * Create a mock Pixi environment for testing. Returns the context `Provider`,
 * the driver fixtures (`ticker`, `renderer`, `app`), and `mount`/`renderHook`
 * helpers bound to the `Provider`.
 *
 * Use `ctx.mount` / `ctx.renderHook` when the scene or hook needs Pixi context;
 * use the top-level `mountScene` / `renderHook` (with an optional custom
 * `wrapper`) when it does not.
 *
 * ```tsx
 * const ctx = createTestContext();
 *
 * const { getByLabel } = ctx.mount(() => <MyComponent />);
 * const { result } = ctx.renderHook(() => usePixiScreen());
 *
 * // Advance time frame-by-frame
 * await ctx.ticker.fastForwardFrames(10);
 *
 * // Simulate resize
 * ctx.renderer.emitResize({ width: 1024, height: 768 });
 *
 * // Spy with your framework (no vitest coupling)
 * const spy = vi.spyOn(ctx.renderer, "addListener");
 * ```
 *
 * To override defaults (e.g. inject a spied ticker), pass options:
 * ```ts
 * const manual = createManualTicker();
 * vi.spyOn(manual.ticker, "add");
 * const ctx = createTestContext({ ticker: manual });
 * ```
 */
export const createTestContext = (options?: {
  ticker?: ManualTicker;
  renderer?: TestRenderer;
  app?: Pixi.Application;
}): TestContext => {
  const renderer: TestRenderer =
    options?.renderer ??
    (() => {
      const listenersByEvent = new Map<string, Set<() => void>>();

      const r: TestRenderer = {
        screen: { width: 800, height: 600, x: 0, y: 0 },
        addListener: (event, listener) => {
          let listeners = listenersByEvent.get(event);
          if (!listeners) {
            listeners = new Set();
            listenersByEvent.set(event, listeners);
          }
          listeners.add(listener);
        },
        removeListener: (event, listener) => {
          listenersByEvent.get(event)?.delete(listener);
        },
        emit: (event) => {
          listenersByEvent.get(event)?.forEach((fn) => fn());
        },
        emitResize: (nextScreen) => {
          if (nextScreen) Object.assign(r.screen, nextScreen);
          r.emit("resize");
        },
      };

      return r;
    })();

  const app: Pixi.Application =
    options?.app ??
    ({
      renderer,
      stage: new Container(),
      ticker: new Ticker(),
      canvas: document.createElement("canvas"),
    } as unknown as Pixi.Application);

  const manualTicker = options?.ticker ?? createManualTicker();

  const Provider = (props: ParentProps): JSX.Element => {
    const pixiScreenStore = createPixiScreenStore(renderer as unknown as Pixi.Renderer);

    return (
      <PixiAppContext value={app}>
        <TickerContext value={manualTicker.ticker}>
          <ScreenStoreContext value={pixiScreenStore}>{props.children}</ScreenStoreContext>
        </TickerContext>
      </PixiAppContext>
    );
  };

  return {
    Provider,
    ticker: manualTicker,
    renderer,
    app,
    mount: <TRoot = Pixi.Container,>(setup: () => JSX.Element) =>
      createMountScene<TRoot>(setup, { wrapper: Provider }),
    renderHook: <T,>(callback: () => T) => createRenderHook(callback, { wrapper: Provider }),
  };
};
