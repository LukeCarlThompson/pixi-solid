import type { ApplicationOptions, Ticker, TickerCallback } from "pixi.js";
import { Show, createContext, createEffect, createResource, onCleanup, splitProps, useContext } from "solid-js";

import { Application } from "pixi.js";
import { CommonPropKeys } from "./pixi-components";
import type { ContainerProps } from "./pixi-components";
import { solidPixiEvents } from "./pixi-events";
import { spread } from "./runtime";

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

export type PixiAppProviderProps = Partial<Omit<ApplicationOptions, "children">> & ContainerProps<Application>;

export const PixiAppProvider = (props: PixiAppProviderProps) => {
  const [common, events, rest] = splitProps(
    props,
    CommonPropKeys,
    Object.keys(props).filter((key) => solidPixiEvents.has(key)) as (keyof typeof props)[]
  );

  const [appResource] = createResource(async () => {
    // Enforce singleton pattern: Check if an app already exists
    // @ts-expect-error
    if (globalThis.__PIXI_DEVTOOLS__) {
      throw new Error("Only one PixiAppProvider can be active at a time. Multiple instances detected.");
    }

    const app = common.as || new Application();
    await app.init({
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      antialias: false,
      sharedTicker: true,
      ...rest,
    });

    // @ts-expect-error
    globalThis.__PIXI_DEVTOOLS__ = {
      app,
    };

    return app;
  });

  createEffect(() => {
    const app = appResource();
    if (app) {
      spread(app, () => ({ ...rest, ...events }));

      app.ticker.autoStart = false;
      app.ticker.start();

      onCleanup(() => {
        app.destroy(true, { children: true });
        // @ts-expect-error
        globalThis.__PIXI_DEVTOOLS__ = undefined;
      });
    }
  });

  return (
    <Show when={appResource()}>
      {(app) => <PixiAppContext.Provider value={app()}>{common.children}</PixiAppContext.Provider>}
    </Show>
  );
};
