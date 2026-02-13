import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { TickerContext } from "./pixi-application";

/**
 * Runs a callback when a given number of milliseconds has passed on the ticker.
 *
 * It is guaranteed to be in sync with the shared ticker and uses accumulated deltaMs not an external time measurement.
 *
 * @param delayMs - Number of milliseconds to wait (measured in the ticker's time units).
 *
 * @param callback - A callback function that will fire when the delayMs time has passed.
 *
 * @throws {Error} If called outside of a `PixiApplicationProvider` or `TickerProvider` context.
 *
 * @note It will not run the callback if the ticker is paused or stopped.
 *
 */
export const delay = (delayMs: number, callback?: () => void): void => {
  const ticker = useContext(TickerContext);
  if (!ticker) {
    throw new Error("`delay` must be used within a PixiApplicationProvider or a TickerProvider.");
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

const asyncDelay = async (ticker: Pixi.Ticker, delayMs: number, signal?: AbortSignal) => {
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

  const handleAbort = () => {
    ticker.remove(internalCallback);
    resolvePromise();
  };

  if (signal?.aborted) {
    // Already aborted before we even started
    return;
  }

  signal?.addEventListener("abort", handleAbort);

  ticker.add(internalCallback);
  await promise;
  ticker.remove(internalCallback);
  signal?.removeEventListener("abort", handleAbort);
};

/**
 * Create a delay function that waits until a given number of milliseconds has passed on the current Ticker context before resolving.
 *
 * This function must be called inside a `PixiApplicationProvider` or `TickerProvider` context.
 *
 * @param signal - Optional AbortSignal to resolve the delay early
 * @returns An async function we can await to delay events in sync with time passed on the Ticker.
 *
 * Simply await for it to resolve in an async context. If the signal aborts, the promise resolves immediately.
 *
 * @note It will not resolve if the ticker is paused or stopped.
 *
 * @throws {Error} If called outside of a `PixiApplicationProvider` or `TickerProvider` context.
 */
export const createAsyncDelay = (): ((delayMs: number, signal?: AbortSignal) => Promise<void>) => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error(
      "`createAsyncDelay` must be used within a PixiApplicationProvider or a TickerProvider. The returned delay function can be called in an async context but `createAsyncDelay` must be called in a synchronous scope within a PixiApplicationProvider or a TickerProvider",
    );
  }
  const delayWithTicker = (delayMs: number, signal?: AbortSignal) =>
    asyncDelay(ticker, delayMs, signal);

  return delayWithTicker;
};
