import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { TickerContext } from "./context";

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
export const getTicker = (): Pixi.Ticker => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error("getTicker must be used within a PixiApplication or a TickerProvider");
  }
  return ticker;
};
