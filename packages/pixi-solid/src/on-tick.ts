import type * as Pixi from "pixi.js";
import { UPDATE_PRIORITY } from "pixi.js";
import { onCleanup, useContext } from "solid-js";

import { TickerContext } from "./pixi-application";

/**
 * Registers a callback to run on every frame of the PIXI ticker.
 * The callback is automatically removed when the owning computation is cleaned up.
 *
 * Must be called within `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`.
 *
 * @param tickerCallback - The function to call on each ticker update. It receives
 * the `Pixi.Ticker` instance as its argument.
 * @param priority - Optional priority level for the ticker callback. Defaults to `UPDATE_PRIORITY.NORMAL`.
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
