import { createEffect } from "solid-js";
import { describe, expect, it } from "vitest";

import { createTestRoot } from "../testing";
import { createTestContext } from "../testing";

import { usePixiScreen } from "./use-pixi-screen";

describe("usePixiScreen", () => {
  it("GIVEN no provider WHEN usePixiScreen is called THEN it throws", () => {
    expect(() => {
      createTestRoot(() => {
        usePixiScreen();
      });
    }).toThrow("usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas");
  });

  it("GIVEN provider WHEN hook is read THEN it exposes initial dimensions and derived bounds", () => {
    const ctx = createTestContext();
    let snapshot:
      | {
          width: number;
          height: number;
          x: number;
          y: number;
          left: number;
          right: number;
          top: number;
          bottom: number;
        }
      | undefined;

    const { dispose } = createTestRoot(() => (
      <ctx.Provider>
        {(() => {
          const screen = usePixiScreen();
          snapshot = {
            width: screen.width,
            height: screen.height,
            x: screen.x,
            y: screen.y,
            left: screen.left,
            right: screen.right,
            top: screen.top,
            bottom: screen.bottom,
          };
          return null;
        })()}
      </ctx.Provider>
    ));

    expect(snapshot).toEqual({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });

    dispose();
  });

  it("GIVEN provider WHEN resize changes values THEN hook updates reactively", async () => {
    const ctx = createTestContext();
    let effectRuns = 0;
    const snapshots: Array<{ width: number; x: number; right: number; bottom: number }> = [];

    const { dispose } = createTestRoot(() => (
      <ctx.Provider>
        {(() => {
          const screen = usePixiScreen();

          createEffect(() => {
            snapshots.push({
              width: screen.width,
              x: screen.x,
              right: screen.right,
              bottom: screen.bottom,
            });
            effectRuns += 1;
          });

          return null;
        })()}
      </ctx.Provider>
    ));

    expect(effectRuns).toBe(1);

    ctx.renderer.emitResize({ width: 900, x: 10, y: 20 });
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

    const { dispose } = createTestRoot(() => (
      <ctx.Provider>
        {(() => {
          const screen = usePixiScreen();

          createEffect(() => {
            void screen.width;
            void screen.height;
            void screen.x;
            void screen.y;
            effectRuns += 1;
          });

          return null;
        })()}
      </ctx.Provider>
    ));

    expect(effectRuns).toBe(1);

    ctx.renderer.emitResize();
    await Promise.resolve();

    expect(effectRuns).toBe(1);

    dispose();
  });
});
