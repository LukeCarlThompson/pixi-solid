import { UPDATE_PRIORITY } from "pixi.js";
import { afterEach, describe, expect, it } from "vitest";

import { onTick } from "./on-tick";
import { cleanup, createTestContext, renderHook } from "./testing";

afterEach(() => {
  cleanup();
});

describe("onTick", () => {
  it("GIVEN no provider WHEN onTick is called THEN it throws the library error", () => {
    // GIVEN / WHEN
    const register = () => {
      renderHook(() => {
        onTick(() => {});
      });
    };

    // THEN
    expect(register).toThrow(
      "onTick must be used within a PixiApplicationProvider, PixiCanvas or a TickerProvider",
    );
  });

  it("GIVEN a ticker provider WHEN frames advance THEN the callback runs once per frame", async () => {
    // GIVEN
    const ctx = createTestContext();
    const frames: number[] = [];

    ctx.renderHook(() => {
      onTick((ticker) => frames.push(ticker.lastTime));
    });

    // WHEN
    await ctx.ticker.fastForwardFrames(3);

    // THEN
    expect(frames).toHaveLength(3);
  });

  it("GIVEN two callbacks with different priorities WHEN a frame runs THEN the higher priority runs first", async () => {
    // GIVEN
    const ctx = createTestContext();
    const order: string[] = [];

    ctx.renderHook(() => {
      onTick(() => order.push("low"), UPDATE_PRIORITY.LOW);
      onTick(() => order.push("high"), UPDATE_PRIORITY.HIGH);
    });

    // WHEN
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(order).toEqual(["high", "low"]);
  });

  it("GIVEN a registered callback WHEN the owner is disposed THEN the callback stops running", async () => {
    // GIVEN
    const ctx = createTestContext();
    let frames = 0;

    const { dispose } = ctx.renderHook(() => {
      onTick(() => {
        frames += 1;
      });
    });

    await ctx.ticker.fastForwardFrames(2);
    expect(frames).toBe(2);

    // WHEN
    dispose();
    await ctx.ticker.fastForwardFrames(3);

    // THEN
    expect(frames).toBe(2);
  });
});
