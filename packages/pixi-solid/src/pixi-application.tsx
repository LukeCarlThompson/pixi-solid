import type { ApplicationOptions, Ticker, TickerCallback } from "pixi.js";
import { Application } from "pixi.js";
import type { JSX, ParentProps, Ref } from "solid-js";
import { createContext, createEffect, createResource, onCleanup, Show, splitProps, useContext } from "solid-js";

const PixiAppContext = createContext<Application>();
const TickerContext = createContext<Ticker>();

/**
 * A custom SolidJS hook to access the root PIXI.Application instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 *
 * @returns The PIXI.Application instance provided by the `PixiApplication` component.
 * @throws Will throw an error if used outside of a `PixiApplication` context provider.
 */
export const usePixiApp = () => {
  const app = useContext(PixiAppContext);
  if (!app) {
    throw new Error("usePixiApp must be used within a PixiApplication");
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
 * A SolidJS component that creates and manages a PIXI.Application instance.
 * It provides the application instance through context to be used by child components
 * and custom hooks like `usePixiApp`, `useTick`, and `useTicker`.
 *
 * This component should only be used once in your application.
 *
 * @param props The properties to configure the Pixi.js Application.
 *
 */
export const PixiApplication = (props: PixiApplicationProps) => {
  const [, initialisationProps] = splitProps(props, ["ref", "children"]);

  // TODO: Split props into initialisation props and runtime props

  const [appResource] = createResource(async () => {
    const app = new Application();
    await app.init({
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      sharedTicker: true,
      ...initialisationProps,
    });

    return app;
  });

  createEffect(() => {
    const app = appResource();
    if (app) {
      if (props.ref) {
        // Solid converts the ref prop to a callback function
        (props.ref as unknown as (arg: any) => void)(app);
      }

      // TODO: Go through the other props that can be set at runtime and apply them here
      // e.g. backgroundColor => app.renderer.backgroundColor, etc.

      app.ticker.autoStart = false;
      app.ticker.start();

      onCleanup(() => {
        app.destroy(true, { children: true });
      });
    }
  });

  return (
    <Show when={appResource()}>
      {(app) => (
        <PixiAppContext.Provider value={app()}>
          <TickerContext.Provider value={app().ticker}>{props.children}</TickerContext.Provider>
        </PixiAppContext.Provider>
      )}
    </Show>
  );
};

export type TickerProviderProps = ParentProps<{ ticker: Ticker }>;

/**
 * This is only required if you want a ticker without the Application.
 * It provides context for the `useTick` and `useTicker` hooks so we can run tests that use them without having to instantate a Pixi Application.
 *
 * You need to pass in the ticker instance you want to use so it can be manually controled form the outside for testing.
 */
export const TickerProvider = (props: TickerProviderProps) => {
  return <TickerContext.Provider value={props.ticker}>{props.children}</TickerContext.Provider>;
};

/**
 * useTicker
 *
 * A custom SolidJS hook that provides access to the PIXI.Application's shared Ticker instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 * Or a descendant of `TickerProvider` if being used for testing without an application.
 *
 * @returns The PIXI.Ticker instance from the application context.
 * @throws Will throw an error if used outside of a `PixiApplication` or `TickerProvider` context.
 */
export const useTicker = (): Ticker => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error("useTicker must be used within a PixiApplication or a TickerProvider");
  }
  return ticker;
};

/**
 * useTick
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
export const useTick = (tickerCallback: TickerCallback<Ticker>): void => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error("useTick must be used within a PixiApplication or a TickerProvider");
  }

  ticker.add(tickerCallback);
  onCleanup(() => {
    ticker.remove(tickerCallback);
  });
};

/**
 * Delay until a given number of milliseconds has passed on the application ticker.
 *
 * It is guaranteed to be in sync with the ticker and uses accumulated deltaMs not an external time measurement.
 *
 * Simply await for it to resolve if in an async context or pass in a callback function.
 * It's not recommended to use both techniques at once.
 *
 * @param delayMs - Number of milliseconds to wait (measured in the ticker's time units).
 *
 * @param callback - Optional callback function that will fire when the delayMs time has passed.
 *
 * @returns A Promise that resolves once the ticker's time has advanced by `delayMs`.
 *
 * @throws {Error} If called outside of a `PixiApplication` or `TickerProvider` context.
 *
 * @note It will not resolve or fire the callback if the ticker is paused or stopped.
 *
 */
export const useDelay = async (delayMs: number, callback?: () => void): Promise<void> => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error("useDelay must be used within a PixiApplication or a TickerProvider");
  }

  let timeDelayed = 0;

  let resolvePromise: (value: void | PromiseLike<void>) => void;

  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  const internalCallback = () => {
    timeDelayed += ticker.deltaMS;
    if (timeDelayed < delayMs) return;
    callback?.();
    resolvePromise();
  };

  ticker.add(internalCallback);

  await promise;

  ticker.remove(internalCallback);
};
