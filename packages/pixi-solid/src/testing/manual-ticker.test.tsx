import { afterEach, describe, expect, it } from "vitest";

import { createAsyncDelay } from "../utils";

import { cleanup, createTestContext, createManualTicker } from "./index";

afterEach(() => {
  cleanup();
});

describe("createManualTicker — absolute clock regressions", () => {
  it("GIVEN time has already been fast-forwarded WHEN fastForwardTime is called again THEN the additional time is exactly additive with no dropped first frame", async () => {
    // GIVEN
    const ticker = createManualTicker();
    let elapsed = 0;
    const deltas: number[] = [];
    ticker.ticker.add(() => {
      elapsed += ticker.ticker.deltaMS;
      deltas.push(ticker.ticker.deltaMS);
    });

    // WHEN — first advance
    await ticker.fastForwardTime(100);
    // THEN
    expect(elapsed).toBe(100);

    // WHEN — second advance on top of the first
    deltas.length = 0;
    await ticker.fastForwardTime(50);
    // THEN — exactly 50ms more, and the first step is not silently skipped
    expect(elapsed).toBe(150);
    expect(deltas[0]).toBe(16);
  });

  it("GIVEN frames have already been advanced WHEN fastForwardFrames is called again THEN the full frame count fires each call", async () => {
    // GIVEN
    const ticker = createManualTicker();
    let calls = 0;
    ticker.ticker.add(() => {
      calls++;
    });

    // WHEN — advance 3 frames, then 3 more
    await ticker.fastForwardFrames(3);
    await ticker.fastForwardFrames(3);

    // THEN
    expect(calls).toBe(6);
  });
});

describe("createManualTicker — chained async continuations", () => {
  it("GIVEN a ticker listener starts chained async work (awaited delays) and registers a successor listener via a promise WHEN the ticker is fast-forwarded THEN every promise resolves at the exact ticker time and the successor receives all subsequent ticks without manual flushing", async () => {
    // GIVEN
    const ctx = createTestContext();
    const seen: string[] = [];

    let delay: ReturnType<typeof createAsyncDelay>;
    ctx.renderHook(() => {
      delay = createAsyncDelay();
    });

    let started = false;
    ctx.ticker.ticker.add((t) => {
      if (started) return;
      started = true;
      seen.push(`tick:${t.deltaMS}`);

      // Successor listener registered asynchronously — like a second
      // animation started by an `onEnded` continuation. It accumulates
      // deltaMS exactly like a production animation runner would.
      void Promise.resolve().then(() => {
        let successorTime = 0;
        ctx.ticker.ticker.add((t2) => {
          successorTime += t2.deltaMS;
          seen.push(`successor:${successorTime}`);
        });
      });

      // Chained async work: two sequential awaited delays, each resolving
      // from accumulated ticker deltaMS.
      void (async () => {
        await delay(50);
        seen.push("delay1-done");
        await delay(50);
        seen.push("delay2-done");
      })();
    });

    // WHEN — one fast-forward drives the whole sequence
    await ctx.ticker.fastForwardFrames(10);

    // THEN — no manual `await Promise.resolve()` anywhere; the successor
    // receives every tick after registration, and each delay resolves
    // exactly when its accumulated time passes on the ticker.
    expect(seen).toEqual([
      "tick:16", // frame 1 — main listener starts the chain
      "successor:16", // frame 2
      "successor:32", // frame 3
      "successor:48", // frame 4 — first delay resolves (64ms ticker time)
      "delay1-done", // flushed between frame 4 and 5
      "successor:64", // frame 5
      "successor:80", // frame 6
      "successor:96", // frame 7
      "successor:112", // frame 8 — second delay resolves (128ms ticker time)
      "delay2-done", // flushed between frame 8 and 9
      "successor:128", // frame 9
      "successor:144", // frame 10 — all 9 post-registration frames received
    ]);
  });
});
