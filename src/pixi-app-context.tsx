import type { ApplicationOptions, Ticker, TickerCallback } from "pixi.js";
import type { JSX, ParentProps } from "solid-js";
import { Show, createContext, createResource, onCleanup, useContext } from "solid-js";

import { Application } from "pixi.js";

const PixiAppContext = createContext<Application>();

export const usePixiApp = () => {
  const app = useContext(PixiAppContext);
  if (!app) {
    throw new Error("usePixiApp must be used within a PixiAppProvider");
  }
  return app;
};

export const useTick = (tickerCallback: TickerCallback<Ticker>): void => {
  const app = usePixiApp();
  const ticker = app.ticker;
  ticker.add(tickerCallback);
  onCleanup(() => {
    ticker.remove(tickerCallback);
  });
};

export const useTicker = (): Ticker => {
  const { ticker } = usePixiApp();
  return ticker;
};

export type PixiAppProviderProps = ParentProps & ApplicationOptions;

export const PixiAppProvider = (props: PixiAppProviderProps): JSX.Element => {
  const [app] = createResource(async () => {
    // Enforce singleton pattern: Check if an app already exists
    // @ts-expect-error
    if (globalThis.__PIXI_APP__) {
      throw new Error("Only one PixiAppProvider can be active at a time. Multiple instances detected.");
    }

    const app = new Application();
    await app.init({
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      antialias: false,
      sharedTicker: true,
      ...props,
    });

    app.ticker.autoStart = false;
    app.ticker.start();

    // @ts-expect-error
    globalThis.__PIXI_APP__ = app;

    onCleanup(() => {
      app.destroy(true, { children: true });
      // @ts-expect-error
      globalThis.__PIXI_APP__ = undefined;
    });
    return app;
  });

  return (
    <Show when={app()}>
      <PixiAppContext.Provider value={app()}>{props.children}</PixiAppContext.Provider>
    </Show>
  );
};
