import { describe, expect, it } from "vitest";

import { TickerProvider } from "../../pixi-application";
import { createManualTicker } from "../manual-ticker";
import { renderHook } from "../test-root";
import { createTestContext } from "../test-context";
import { createClockStore } from "./clock-store";

describe("example test", () => {
  it("GIVEN a store that registers onTick WHEN only the ticker context is provided THEN the store updates", () => {
    const manual = createManualTicker();

    // createClockStore uses `onTick`, which only needs TickerContext.
    // Provide just the ticker via TickerProvider — no app, renderer, or
    // screen store required.
    const { result: clock, dispose } = renderHook(() => createClockStore(), {
      wrapper: (props) => (
        <TickerProvider ticker={manual.ticker}>{props.children}</TickerProvider>
      ),
    });

    expect(clock().time).toBe(0);

    manual.fastForwardFrames(3);

    expect(clock().time).toBe(48);

    dispose();
  });

  it("GIVEN a store that registers onTick WHEN the full mock context is provided THEN the store updates", () => {
    const ctx = createTestContext();

    // createTestContext() provides ticker, app, renderer, and screen store —
    // ctx.renderHook applies the mock Provider automatically.
    const { result: clock, dispose } = ctx.renderHook(() => createClockStore());

    expect(clock().time).toBe(0);

    ctx.ticker.fastForwardFrames(3);

    expect(clock().time).toBe(48);

    dispose();
  });
});
