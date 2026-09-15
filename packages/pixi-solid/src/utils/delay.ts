import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { TickerContext } from "../pixi-application";

export type DelayFunction = (delayMs: number, callback: () => void) => void;

export type AsyncDelayFunction = (delayMs: number, signal?: AbortSignal) => Promise<void>;

type CancelDelay = () => void;

const scheduleDelay = (ticker: Pixi.Ticker, delayMs: number, callback: () => void): CancelDelay => {
  let timeDelayed = 0;

  const internalCallback = () => {
    timeDelayed += ticker.deltaMS;
    if (timeDelayed < delayMs) return;

    ticker.remove(internalCallback);
    callback();
  };

  ticker.add(internalCallback);

  return () => {
    ticker.remove(internalCallback);
  };
};

const getDelayTicker = (): Pixi.Ticker => {
  const ticker = useContext(TickerContext);

  if (!ticker) {
    throw new Error(
      "`createDelay` and `createAsyncDelay` must be used within a PixiCanvas, PixiApplicationProvider, or TickerProvider.",
    );
  }

  return ticker;
};

/**
 * Creates a callback-based delay function bound to the current ticker.
 *
 * The ticker is captured when this function is created, so the returned delay
 * function can safely be called from event handlers, ticker callbacks, and
 * asynchronous continuations.
 *
 * @throws {Error} If called outside of a `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` context.
 *
 * @note It will not run the callback if the ticker is paused or stopped.
 */
export const createDelay = (): DelayFunction => {
  const ticker = getDelayTicker();

  return (delayMs, callback) => {
    scheduleDelay(ticker, delayMs, callback);
  };
};

const asyncDelay = (ticker: Pixi.Ticker, delayMs: number, signal?: AbortSignal): Promise<void> => {
  if (signal?.aborted) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    let settled = false;

    const cleanup = () => {
      signal?.removeEventListener("abort", handleAbort);
    };

    const settle = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const handleAbort = () => {
      cancelDelay();
      settle();
    };

    signal?.addEventListener("abort", handleAbort);
    const cancelDelay = scheduleDelay(ticker, delayMs, settle);
  });
};

/**
 * Create a delay function that waits until a given number of milliseconds has passed on the current Ticker context before resolving.
 *
 * This function must be called inside a `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` context.
 *
 * @param signal - Optional AbortSignal to resolve the delay early
 * @returns An async function we can await to delay events in sync with time passed on the Ticker.
 *
 * Simply await for it to resolve in an async context. If the signal aborts, the promise resolves immediately.
 *
 * @note It will not resolve if the ticker is paused or stopped.
 *
 * @throws {Error} If called outside of a `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` context.
 */
export const createAsyncDelay = (): AsyncDelayFunction => {
  const ticker = getDelayTicker();

  return (delayMs, signal) => asyncDelay(ticker, delayMs, signal);
};
