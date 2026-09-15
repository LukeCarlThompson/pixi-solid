import { afterEach, describe, expect, test } from "vitest";

import { cleanup, createTestContext } from "../testing";

import { createAsyncDelay, createDelay } from "./delay";

afterEach(() => {
  cleanup();
});

describe("createDelay", () => {
  test("GIVEN a callback delay WHEN less than the requested ticker time passes THEN the callback does not run", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createDelay()).result();
    let calls = 0;
    delay(32, () => {
      calls += 1;
    });

    // WHEN
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(calls).toBe(0);
  });

  test("GIVEN a callback delay WHEN the requested ticker time passes THEN the callback runs once", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createDelay()).result();
    let calls = 0;
    delay(32, () => {
      calls += 1;
    });

    // WHEN
    await ctx.ticker.fastForwardFrames(2);
    await ctx.ticker.fastForwardFrames(2);

    // THEN
    expect(calls).toBe(1);
  });

  test("GIVEN a delay created inside ticker context WHEN nested delays are scheduled from a callback THEN both delays use the captured ticker", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createDelay()).result();
    const completed: string[] = [];

    delay(32, () => {
      completed.push("first");
      delay(32, () => {
        completed.push("second");
      });
    });

    // WHEN
    await ctx.ticker.fastForwardTime(32);

    // THEN
    expect(completed).toEqual(["first"]);

    // WHEN
    await ctx.ticker.fastForwardTime(32);

    // THEN
    expect(completed).toEqual(["first", "second"]);
  });

  test("GIVEN no ticker context WHEN createDelay is called THEN it throws", () => {
    // GIVEN / WHEN
    const create = () => createDelay();

    // THEN
    expect(create).toThrow(
      "`createDelay` and `createAsyncDelay` must be used within a PixiCanvas, PixiApplicationProvider, or TickerProvider.",
    );
  });
});

describe("createAsyncDelay", () => {
  test("GIVEN no ticker context WHEN createAsyncDelay is called THEN it throws", () => {
    // GIVEN / WHEN
    const create = () => createAsyncDelay();

    // THEN
    expect(create).toThrow(
      "`createDelay` and `createAsyncDelay` must be used within a PixiCanvas, PixiApplicationProvider, or TickerProvider.",
    );
  });

  test("GIVEN an async delay without a signal WHEN less than the requested ticker time passes THEN it remains pending", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createAsyncDelay()).result();
    let resolved = false;
    const promise = delay(32).then(() => {
      resolved = true;
    });

    // WHEN
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(resolved).toBe(false);

    // WHEN
    await ctx.ticker.fastForwardFrames(1);
    await promise;

    // THEN
    expect(resolved).toBe(true);
  });

  test("GIVEN an async delay with a signal WHEN the requested ticker time passes THEN it resolves and ignores later aborts", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createAsyncDelay()).result();
    const controller = new AbortController();
    const promise = delay(32, controller.signal);

    // WHEN
    await ctx.ticker.fastForwardFrames(2);
    await promise;
    controller.abort();

    // THEN
    await expect(promise).resolves.toBeUndefined();
  });

  test("GIVEN a pending async delay WHEN its signal aborts THEN it resolves immediately and does not resolve again from ticker time", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createAsyncDelay()).result();
    const controller = new AbortController();
    let resolutions = 0;
    const promise = delay(100, controller.signal).then(() => {
      resolutions += 1;
    });

    // WHEN
    controller.abort();
    await promise;
    await ctx.ticker.fastForwardTime(100);

    // THEN
    expect(resolutions).toBe(1);
  });

  test("GIVEN an already aborted signal WHEN an async delay starts THEN it resolves without ticker time", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createAsyncDelay()).result();
    const controller = new AbortController();
    controller.abort();

    // WHEN
    const promise = delay(100, controller.signal);

    // THEN
    await expect(promise).resolves.toBeUndefined();
    await ctx.ticker.fastForwardTime(100);
  });

  test("GIVEN an async delay function WHEN sequential delays are awaited THEN each delay uses the captured ticker", async () => {
    // GIVEN
    const ctx = createTestContext();
    const delay = ctx.renderHook(() => createAsyncDelay()).result();
    const completed: string[] = [];

    const sequence = (async () => {
      await delay(32);
      completed.push("first");
      await delay(32);
      completed.push("second");
    })();

    // WHEN
    await ctx.ticker.fastForwardTime(32);

    // THEN
    expect(completed).toEqual(["first"]);

    // WHEN
    await ctx.ticker.fastForwardTime(32);
    await sequence;

    // THEN
    expect(completed).toEqual(["first", "second"]);
  });
});
