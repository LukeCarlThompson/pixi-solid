import type { Ticker, TickerCallback } from "pixi.js";

import { onCleanup } from "solid-js";
import { usePixiApp } from "./pixi-application";

export const useTicker = (): Ticker => usePixiApp().ticker;

export const useTick = (tickerCallback: TickerCallback<Ticker>): void => {
  const { ticker } = usePixiApp();

  ticker.add(tickerCallback);
  onCleanup(() => {
    ticker.remove(tickerCallback);
  });
};
