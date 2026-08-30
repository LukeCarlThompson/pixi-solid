import { Ticker } from "pixi.js";

/**
 * A manually-controlled ticker for tests. Created stopped by default so you
 * control exactly when frames advance.
 *
 * The driver methods are async: after every tick they flush microtasks so
 * promise-based continuations (e.g. an animation `onEnded`, an awaited
 * `delay`) run before the next tick. Successive calls are additive — the
 * ticker owns a monotonic absolute clock that is never reset between calls.
 *
 * @example
 * ```ts
 * const ticker = createManualTicker();
 *
 * let elapsed = 0;
 * onTick((t) => { elapsed += t.deltaMS; });
 *
 * // Advance 10 frames at 16ms each
 * await ticker.fastForwardFrames(10);
 * expect(elapsed).toBe(160);
 *
 * // Or advance through a time span in small steps
 * await ticker.fastForwardTime(1000); // 1 second of ~60fps frames
 * ```
 */
export type ManualTicker = {
  /** The underlying PixiJS Ticker instance. */
  ticker: Ticker;

  /**
   * Advance by a specific number of frames, each with the given delta time.
   * Use this when you want precise frame counting (e.g. stepping through an
   * animation frame-by-frame).
   */
  fastForwardFrames(frames: number, deltaTime?: number): Promise<void>;

  /**
   * Advance through a total time span in small steps.
   * Use this when you want to simulate a real-time duration (e.g. 1 second of
   * gameplay at ~60fps). The smaller the step size, the more realistic the
   * delta times seen by ticker callbacks.
   */
  fastForwardTime(totalTimeMS: number, stepSizeMS?: number): Promise<void>;
};

/**
 * Create a stopped, manually-controlled ticker for use in tests.
 *
 * PixiJS `new Ticker()` is already stopped by default (`autoStart = false`).
 * This factory wraps it with convenience methods to advance frame-by-frame
 * or through a time span, avoiding the footgun of large single-frame deltas.
 */
export const createManualTicker = (): ManualTicker => {
  const ticker = new Ticker();

  // Seed `lastTime` so the first driver step produces exactly the requested
  // delta. PixiJS initialises `lastTime` to `-1`, which would otherwise make
  // the first frame's delta one millisecond too large
  // (`deltaMS = currentTime - (-1)`).
  ticker.lastTime = 0;

  // Monotonic absolute clock owned by the ticker. Never reset between calls,
  // so successive `fastForward*` calls are exactly additive and no first
  // frame is ever skipped (PixiJS `update()` always writes `lastTime`, even
  // when the new time is not greater than the previous one).
  let tickerTime = 0;

  // Flush microtasks between ticks so async continuations (promises resolved
  // during a tick) run before the next tick. Two flushes resolve one-level
  // and two-level chains (delay -> store action, glide end -> settle start);
  // the second flush is safety margin.
  const flushMicrotasks = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
  };

  return {
    ticker,
    async fastForwardFrames(frames: number, deltaTime: number = 16): Promise<void> {
      for (let i = 0; i < frames; i++) {
        tickerTime += deltaTime;
        ticker.update(tickerTime);
        await flushMicrotasks();
      }
    },
    async fastForwardTime(totalTimeMS: number, stepSizeMS: number = 16): Promise<void> {
      const targetTime = tickerTime + totalTimeMS;
      while (tickerTime < targetTime) {
        tickerTime = Math.min(tickerTime + stepSizeMS, targetTime);
        ticker.update(tickerTime);
        await flushMicrotasks();
      }
    },
  };
};
