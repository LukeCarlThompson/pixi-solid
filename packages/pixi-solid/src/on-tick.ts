import type * as Pixi from "pixi.js";
import { UPDATE_PRIORITY } from "pixi.js";
import { onCleanup, useContext } from "solid-js";

import { TickerContext } from "./pixi-application";

/**
 * onTick
 *
 * A custom SolidJS hook that registers a callback function to be executed on every frame
 * of the PIXI.Application's ticker. The callback is automatically removed when the
 * component or hook's owning computation is cleaned up.
 *
 * This hook must be called from a component that is a descendant of `PixiCanvas`,
 * `PixiApplicationProvider`, or `TickerProvider`.
 *
 * @param tickerCallback - The function to call on each ticker update. It receives
 * the `Pixi.Ticker` instance as its argument.
 * @param priority - An optional priority level for the ticker callback.
 *
 */
export const onTick = (
  tickerCallback: Pixi.TickerCallback<Pixi.Ticker>,
  priority: Pixi.UPDATE_PRIORITY = UPDATE_PRIORITY.NORMAL,
): void => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error(
      "onTick must be used within a PixiApplicationProvider, PixiCanvas or a TickerProvider",
    );
  }

  ticker.add(tickerCallback, ticker, priority);

  onCleanup(() => {
    ticker.remove(tickerCallback, ticker);
  });
};
