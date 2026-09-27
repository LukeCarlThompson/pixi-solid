import { createSignal, flush } from "solid-js";
import { afterEach, describe, expect, test } from "vitest";

import { cleanup, createTestContext } from "../testing";

import { useSmoothDamp } from "./smooth-damp";

afterEach(() => {
  cleanup();
});

describe("useSmoothDamp", () => {
  test("GIVEN a target above the current value WHEN a frame passes THEN the value moves toward the target", async () => {
    // GIVEN
    const ctx = createTestContext();
    let setTarget: (value: number) => void = () => undefined;
    const damp = ctx
      .renderHook(() => {
        const [target, set] = createSignal(0);
        setTarget = set;
        return useSmoothDamp({ to: target });
      })
      .result();

    // WHEN
    setTarget(100);
    flush();
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(damp.value()).toBeGreaterThan(0);
    expect(damp.value()).toBeLessThan(100);
    expect(damp.velocity()).toBeGreaterThan(0);
  });

  test("GIVEN a moving value WHEN enough time passes THEN it converges to the target and stops", async () => {
    // GIVEN
    const ctx = createTestContext();
    let setTarget: (value: number) => void = () => undefined;
    const damp = ctx
      .renderHook(() => {
        const [target, set] = createSignal(0);
        setTarget = set;
        return useSmoothDamp({ to: target });
      })
      .result();

    // WHEN
    setTarget(100);
    flush();
    await ctx.ticker.fastForwardTime(3000);

    // THEN
    expect(damp.value()).toBe(100);
    expect(damp.velocity()).toBe(0);
  });

  test("GIVEN a value with no target change WHEN frames pass THEN it stays put", async () => {
    // GIVEN
    const ctx = createTestContext();
    const damp = ctx.renderHook(() => useSmoothDamp({ to: () => 25 })).result();

    // WHEN
    await ctx.ticker.fastForwardFrames(5);

    // THEN
    expect(damp.value()).toBe(25);
    expect(damp.velocity()).toBe(0);
  });

  test("GIVEN setValue is called WHEN the value is read THEN it reflects the new value immediately", () => {
    // GIVEN
    const ctx = createTestContext();
    const damp = ctx.renderHook(() => useSmoothDamp({ to: () => 0 })).result();

    // WHEN
    damp.setValue(42);
    flush();

    // THEN
    expect(damp.value()).toBe(42);
  });
});
