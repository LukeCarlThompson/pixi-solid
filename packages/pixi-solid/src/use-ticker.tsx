import type { Ticker, TickerCallback } from "pixi.js";

import { onCleanup } from "solid-js";
import { usePixiApp } from "./pixi-application";

/**
 * useTicker
 *
 * A custom SolidJS hook that provides access to the PIXI.Application's shared Ticker instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 *
 * @returns The PIXI.Ticker instance from the application context.
 * @throws Will throw an error if used outside of a `PixiApplication` context provider.
 *
 * **Example**
 * {@includeCode ./examples/useTicker.example.tsx}
 */
export const useTicker = (): Ticker => usePixiApp().ticker;

/**
 * useTick
 *
 * A custom SolidJS hook that registers a callback function to be executed on every frame
 * of the PIXI.Application's ticker. The callback is automatically removed when the
 * component or hook's owning computation is cleaned up.
 *
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 *
 * @param tickerCallback - The function to call on each ticker update. It receives
 *   the `PIXI.Ticker` instance as its argument.
 *
 */
export const useTick = (tickerCallback: TickerCallback<Ticker>): void => {
  const { ticker } = usePixiApp();

  ticker.add(tickerCallback);
  onCleanup(() => {
    ticker.remove(tickerCallback);
  });
};
