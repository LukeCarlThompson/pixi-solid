import type { ApplicationOptions, Rectangle, Ticker, TickerCallback } from "pixi.js";
import { Application } from "pixi.js";
import type { JSX, ParentProps, Ref } from "solid-js";
import {
  batch,
  createContext,
  createEffect,
  createResource,
  on,
  onCleanup,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

export type PixiScreenDimensions = {
  width: number;
  height: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
  x: number;
  y: number;
};

const PixiAppContext = createContext<Application>();
const TickerContext = createContext<Ticker>();
const PixiScreenContext = createContext<Readonly<PixiScreenDimensions>>();

/**
 * A custom SolidJS hook to access the root PIXI.Application instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 *
 * @returns The PIXI.Application instance provided by the `PixiApplication` component.
 * @throws Will throw an error if used outside of a `PixiApplication` context provider.
 */
export const getPixiApp = () => {
  const app = useContext(PixiAppContext);
  if (!app) {
    throw new Error("getPixiApp must be used within a PixiApplication");
  }
  return app;
};

/**
 * Props for the `PixiApplication` component. It extends the PIXI.ApplicationOptions
 * to allow passing configuration directly to the Pixi.js Application constructor,
 * but omits properties that are handled by the component itself.
 */
export type PixiApplicationProps = Partial<Omit<ApplicationOptions, "children" | "resizeTo">> & {
  ref?: Ref<Application>;
  children?: JSX.Element;
};

/**
 * A SolidJS component that creates a PIXI.Application instance and works as a context provider.
 * It provides the application instance through context to be used by child components
 * and custom hooks like `getPixiApp`, `onTick`, `getTicker` and `usePixiScreen`.
 *
 * This component should only be used once in your application.
 *
 * @param props The properties to configure the Pixi.js Application.
 *
 */
export const PixiApplication = (props: PixiApplicationProps) => {
  const [, initialisationProps] = splitProps(props, ["ref", "children"]);
  const [pixiScreenDimensions, setPixiScreenDimensions] = createStore<PixiScreenDimensions>({
    width: 800,
    height: 600,
    left: 0,
    right: 800,
    top: 0,
    bottom: 600,
    x: 0,
    y: 0,
  });

  const [appResource] = createResource(async () => {
    const app = new Application();
    await app.init({
      resolution: window.devicePixelRatio,
      autoDensity: true,
      ...initialisationProps,
    });

    return app;
  });

  const updatePixiScreenStore = (screen: Rectangle) => {
    batch(() => {
      setPixiScreenDimensions(screen);
      setPixiScreenDimensions("left", screen.x);
      setPixiScreenDimensions("top", screen.y);
      setPixiScreenDimensions("right", screen.x + screen.width);
      setPixiScreenDimensions("bottom", screen.y + screen.height);
    });
  };

  createEffect(
    on(appResource, (app) => {
      if (!app) return;
      if (props.ref) {
        // Solid converts the ref prop to a callback function
        (props.ref as unknown as (arg: any) => void)(app);
      }

      updatePixiScreenStore(app.renderer.screen);

      const handleResize = () => {
        updatePixiScreenStore(app.renderer.screen);
      };

      app.renderer.addListener("resize", handleResize);

      onCleanup(() => {
        app.renderer.removeListener("resize", handleResize);
        app.destroy(true, { children: true });
      });
    }),
  );

  return (
    <Show when={appResource()}>
      {(app) => (
        <PixiAppContext.Provider value={app()}>
          <TickerContext.Provider value={app().ticker}>
            <PixiScreenContext.Provider value={pixiScreenDimensions}>{props.children}</PixiScreenContext.Provider>
          </TickerContext.Provider>
        </PixiAppContext.Provider>
      )}
    </Show>
  );
};

export type TickerProviderProps = ParentProps<{ ticker: Ticker }>;

/**
 * This is only required if you want a ticker without the Application.
 * It provides context for the `onTick` and `getTicker` hooks so we can run tests that use them without having to instantate a Pixi Application.
 *
 * You need to pass in the ticker instance you want to use so it can be manually controled form the outside for testing.
 */
export const TickerProvider = (props: TickerProviderProps) => {
  return <TickerContext.Provider value={props.ticker}>{props.children}</TickerContext.Provider>;
};

/**
 * getTicker
 *
 * A custom SolidJS hook that provides access to the PIXI.Application's shared Ticker instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 * Or a descendant of `TickerProvider` if being used for testing without an application.
 *
 * @returns The PIXI.Ticker instance from the application context.
 * @throws Will throw an error if used outside of a `PixiApplication` or `TickerProvider` context.
 */
export const getTicker = (): Ticker => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error("getTicker must be used within a PixiApplication or a TickerProvider");
  }
  return ticker;
};

/**
 * onTick
 *
 * A custom SolidJS hook that registers a callback function to be executed on every frame
 * of the PIXI.Application's ticker. The callback is automatically removed when the
 * component or hook's owning computation is cleaned up.
 *
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 * Or a descendant of `TickerProvider` if being used for testing without an application.
 *
 * @param tickerCallback - The function to call on each ticker update. It receives
 * the `PIXI.Ticker` instance as its argument.
 *
 */
export const onTick = (tickerCallback: TickerCallback<Ticker>): void => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error("onTick must be used within a PixiApplication or a TickerProvider");
  }

  ticker.add(tickerCallback);
  onCleanup(() => {
    ticker.remove(tickerCallback);
  });
};

const asyncDelay = async (ticker: Ticker, delayMs: number) => {
  // TODO: Make this abortable.
  let timeDelayed = 0;

  let resolvePromise: (value: void | PromiseLike<void>) => void;

  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  const internalCallback = () => {
    timeDelayed += ticker.deltaMS;
    if (timeDelayed < delayMs) return;
    resolvePromise();
  };

  ticker.add(internalCallback);

  await promise;

  ticker.remove(internalCallback);
};

/**
 * Create a delay function that waits until a given number of milliseconds has passed on the current Ticker context before resolving.
 *
 * This function must be called inside a `PixiApplication` or `TickerProvider` context.
 *
 * @returns An async function we can await to delay events in sync with time passed on the Ticker.
 *
 * Simply await for it to resolve in an async context.
 *
 * @note It will not resolve if the ticker is paused or stopped.
 *
 * @throws {Error} If called outside of a `PixiApplication` or `TickerProvider` context.
 */
export const createAsyncDelay = (): ((delayMs: number) => Promise<void>) => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error(
      "`createDelay` must be used within a PixiApplication or a TickerProvider. The returned `delay` function can be called in an async context but `createDelay` must be called in a synchronous scope within a PixiApplication or a TickerProvider",
    );
  }
  const delayWithTicker = (delayMs: number) => asyncDelay(ticker, delayMs);

  return delayWithTicker;
};

/**
 * Runs a callback when a given number of milliseconds has passed on the ticker.
 *
 * It is guaranteed to be in sync with the shared ticker and uses accumulated deltaMs not an external time measurement.
 *
 * @param delayMs - Number of milliseconds to wait (measured in the ticker's time units).
 *
 * @param callback - A callback function that will fire when the delayMs time has passed.
 *
 * @throws {Error} If called outside of a `PixiApplication` or `TickerProvider` context.
 *
 * @note It will not run the callback if the ticker is paused or stopped.
 *
 */
export const delay = (delayMs: number, callback?: () => void): void => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error(
      "`createDelay` must be used within a PixiApplication or a TickerProvider. The returned `delay` function can be called in an async context but `createDelay` must be called in a synchronous scope within a PixiApplication or a TickerProvider",
    );
  }

  let timeDelayed = 0;

  const internalCallback = () => {
    timeDelayed += ticker.deltaMS;
    if (timeDelayed < delayMs) return;
    callback?.();
    ticker.remove(internalCallback);
  };

  ticker.add(internalCallback);
};

/**
 * A hook that provides the current dimensions of the Pixi application's screen as a reactive object.
 * The properties of the returned object will update automatically when the screen size changes and can be subscribed to reactively.
 *
 * @returns An object containing the width and height of the Pixi screen.
 * @throws Will throw an error if not used within a `<PixiApplication>` component.
 */
export const usePixiScreen = (): Readonly<PixiScreenDimensions> => {
  const pixiScreen = useContext(PixiScreenContext);
  if (!pixiScreen) {
    throw new Error("usePixiScreen must be used within a PixiApplication");
  }
  return pixiScreen;
};
