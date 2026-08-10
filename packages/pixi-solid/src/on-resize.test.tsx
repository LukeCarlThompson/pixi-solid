import { createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { createTestContext } from "./testing";
import { onResize } from "./on-resize";
import { usePixiScreen } from "./use-pixi-screen";

describe("onResize + usePixiScreen", () => {
  it("GIVEN onResize is used WHEN the hook mounts THEN callback fires once on init", () => {
    const ctx = createTestContext();
    let callbackCalls = 0;

    ctx.renderHook(() => {
      onResize(() => {
        callbackCalls += 1;
      });

      return null;
    });

    expect(callbackCalls).toBe(1);
  });

  it("GIVEN onResize and usePixiScreen WHEN size changes THEN callback sees updated screen values", async () => {
    const ctx = createTestContext();
    const onResizeSnapshots: Array<{ callbackWidth: number; storeWidth: number }> = [];

    ctx.renderHook(() => {
      const pixiScreen = usePixiScreen();

      onResize((screen) => {
        onResizeSnapshots.push({
          callbackWidth: screen.width,
          storeWidth: pixiScreen.width,
        });
      });

      return null;
    });

    ctx.renderer.emitResize({ width: 1024 });
    await Promise.resolve();

    const latestSnapshot = onResizeSnapshots[onResizeSnapshots.length - 1];
    expect(latestSnapshot).toEqual({ callbackWidth: 1024, storeWidth: 1024 });
  });

  it("GIVEN resize event fires with unchanged values WHEN both hooks are used THEN onResize fires but usePixiScreen signal does not re-run", async () => {
    const ctx = createTestContext();
    let onResizeCalls = 0;
    let pixiScreenEffectRuns = 0;

    ctx.renderHook(() => {
      const pixiScreen = usePixiScreen();

      createEffect(() => {
        // Track all primitive screen fields to count reactive re-runs.
        void pixiScreen.width;
        void pixiScreen.height;
        void pixiScreen.x;
        void pixiScreen.y;
        pixiScreenEffectRuns += 1;
      });

      onResize(() => {
        onResizeCalls += 1;
      });

      return null;
    });

    expect(pixiScreenEffectRuns).toBe(1);
    expect(onResizeCalls).toBe(1);

    ctx.renderer.emitResize();
    await Promise.resolve();

    expect(onResizeCalls).toBe(2);
    expect(pixiScreenEffectRuns).toBe(1);
  });
});
