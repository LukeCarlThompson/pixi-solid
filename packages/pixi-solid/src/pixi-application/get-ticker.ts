import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { TickerContext } from "./context";

/**
 * A custom SolidJS hook that provides access to the Pixi Ticker instance.
 * This hook must be called from a component that is a descendant of `PixiApplicationProvider`, `PixiCanvas` or `TickerProvider`.
 *
 * @returns The Pixi.Ticker instance from the nearest context provider.
 */
export const getTicker = (): Pixi.Ticker => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error(
      "getTicker must be used within a PixiApplicationProvider, PixiCanvas, or TickerProvider",
    );
  }
  return ticker;
};
