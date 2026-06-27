import { Ticker } from "pixi.js";

/**
 * A manually-controlled ticker for tests. Created stopped by default so you
 * control exactly when frames advance.
 *
 * @example
 * ```ts
 * const ticker = createManualTicker();
 *
 * let elapsed = 0;
 * onTick((t) => { elapsed += t.deltaMS; });
 *
 * // Advance 10 frames at 16ms each
 * ticker.fastForwardFrames(10);
 * expect(elapsed).toBe(160);
 *
 * // Or advance through a time span in small steps
 * ticker.fastForwardTime(1000); // 1 second of ~60fps frames
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
  fastForwardFrames(frames: number, deltaTime?: number): void;

  /**
   * Advance through a total time span in small steps.
   * Use this when you want to simulate a real-time duration (e.g. 1 second of
   * gameplay at ~60fps). The smaller the step size, the more realistic the
   * delta times seen by ticker callbacks.
   */
  fastForwardTime(totalTimeMS: number, stepSizeMS?: number): void;
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

  return {
    ticker,
    fastForwardFrames(frames: number, deltaTime: number = 16): void {
      let cumulative = 0;
      for (let i = 0; i < frames; i++) {
        cumulative += deltaTime;
        ticker.update(cumulative);
      }
    },
    fastForwardTime(totalTimeMS: number, stepSizeMS: number = 16): void {
      let cumulative = 0;
      while (cumulative < totalTimeMS) {
        cumulative = Math.min(cumulative + stepSizeMS, totalTimeMS);
        ticker.update(cumulative);
      }
    },
  };
};
