import { createRenderEffect, flush } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, createTestContext, renderHook } from "../testing";

import { usePixiScreen } from "./use-pixi-screen";

afterEach(() => {
  cleanup();
});

describe("usePixiScreen", () => {
  it("GIVEN no provider WHEN usePixiScreen is called THEN it throws", () => {
    expect(() => {
      renderHook(() => {
        usePixiScreen();
      });
    }).toThrow("usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas");
  });

  it("GIVEN provider WHEN hook is read THEN it exposes initial dimensions and derived bounds", () => {
    const ctx = createTestContext();

    const { result, dispose } = ctx.renderHook(() => usePixiScreen());

    expect(result().width).toBe(800);
    expect(result().height).toBe(600);
    expect(result().x).toBe(0);
    expect(result().y).toBe(0);
    expect(result().left).toBe(0);
    expect(result().right).toBe(800);
    expect(result().top).toBe(0);
    expect(result().bottom).toBe(600);

    dispose();
  });

  it("GIVEN provider WHEN resize changes values THEN hook updates reactively", async () => {
    const ctx = createTestContext();
    let effectRuns = 0;
    const snapshots: Array<{ width: number; x: number; right: number; bottom: number }> = [];

    const { dispose } = ctx.renderHook(() => {
      const screen = usePixiScreen();

      createRenderEffect(
        () => ({
          width: screen.width,
          x: screen.x,
          right: screen.right,
          bottom: screen.bottom,
        }),
        (snapshot) => {
          snapshots.push(snapshot);
          effectRuns += 1;
        },
      );

      return screen;
    });

    expect(effectRuns).toBe(1);

    ctx.renderer.emitResize({ width: 900, x: 10, y: 20 });
    flush();
    await Promise.resolve();

    expect(effectRuns).toBe(2);
    expect(snapshots[snapshots.length - 1]).toEqual({
      width: 900,
      x: 10,
      right: 910,
      bottom: 620,
    });

    dispose();
  });

  it("GIVEN provider WHEN resize event fires with unchanged values THEN hook signals do not re-run", async () => {
    const ctx = createTestContext();
    let effectRuns = 0;

    const { dispose } = ctx.renderHook(() => {
      const screen = usePixiScreen();

      createRenderEffect(
        () => ({
          width: screen.width,
          height: screen.height,
          x: screen.x,
          y: screen.y,
        }),
        () => {
          effectRuns += 1;
        },
      );
    });

    expect(effectRuns).toBe(1);

    ctx.renderer.emitResize();
    flush();
    await Promise.resolve();

    expect(effectRuns).toBe(1);

    dispose();
  });
});
