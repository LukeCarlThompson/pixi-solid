import { Container3D, Plane, Vector3 } from "@pixi/3d";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Camera3D, View3D, View3DProvider } from "../components";
import { useScreenToWorld, useWorldToScreen } from "../utils";

describe("3D projection utils", () => {
  it("useWorldToScreen reactively projects 3D coordinates onto 2D screen", async () => {
    const ctx = createTestContext();
    const [pos, setPos] = createSignal({ x: 0, y: 0, z: 0 });
    let projectedResult: any;

    const TestComponent = () => {
      const screenPos = useWorldToScreen(pos);
      projectedResult = screenPos;
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3D width={800} height={600}>
          <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          <TestComponent />
        </View3D>
      </ctx.Provider>
    ));

    expect(projectedResult).toBeDefined();
    expect(projectedResult().visible).toBe(true);
    // Origin centered in 800x600 viewport
    expect(projectedResult().x).toBeCloseTo(400, -1);
    expect(projectedResult().y).toBeCloseTo(300, -1);

    // Move target in 3D
    setPos({ x: 2, y: 0, z: 0 });
    await ctx.ticker.fastForwardFrames(1);

    expect(projectedResult().x).toBeGreaterThan(400);

    cleanup();
  });

  it("useWorldToScreen works directly with a Container3D reference", async () => {
    const ctx = createTestContext();
    const node = new Container3D();
    node.position.set(0, 0, 0);
    let projectedResult: any;

    const TestComponent = () => {
      const screenPos = useWorldToScreen(node);
      projectedResult = screenPos;
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3D width={800} height={600}>
          <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          <TestComponent />
        </View3D>
      </ctx.Provider>
    ));

    expect(projectedResult().visible).toBe(true);
    expect(projectedResult().x).toBeCloseTo(400, -1);

    node.position.x = -2;
    await ctx.ticker.fastForwardFrames(1);

    expect(projectedResult().x).toBeLessThan(400);

    cleanup();
  });

  it("useScreenToWorld reactively unprojects 2D screen coordinates onto a 3D plane", async () => {
    const ctx = createTestContext();
    const ground = new Plane(new Vector3(0, 1, 0), 0); // y = 0
    const [cursor, setCursor] = createSignal({ x: 400, y: 300 }); // center of 800x600
    let unprojectedResult: any;

    const TestComponent = () => {
      const hit = useScreenToWorld(cursor, ground);
      unprojectedResult = hit;
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3D width={800} height={600}>
          <Camera3D x={0} y={10} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          <TestComponent />
        </View3D>
      </ctx.Provider>
    ));

    expect(unprojectedResult()).toBeDefined();
    expect(unprojectedResult()?.y).toBeCloseTo(0, 1);

    // Shift screen cursor to the right
    setCursor({ x: 600, y: 300 });
    await ctx.ticker.fastForwardFrames(1);

    expect(unprojectedResult()?.x).toBeGreaterThan(0);

    cleanup();
  });

  it("useWorldToScreen works seamlessly on a 2D sibling inside View3DProvider", async () => {
    const ctx = createTestContext();
    const node = new Container3D();
    node.position.set(0, 0, 0);
    let projectedResult: any;

    const SiblingHUD = () => {
      // Notice: no view passed, no ref passed!
      const screenPos = useWorldToScreen(node);
      projectedResult = screenPos;
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3DProvider>
          {/* 3D Viewport */}
          <View3D width={800} height={600}>
            <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          </View3D>

          {/* Sibling 2D component */}
          <SiblingHUD />
        </View3DProvider>
      </ctx.Provider>
    ));

    expect(projectedResult).toBeDefined();
    expect(projectedResult().visible).toBe(true);
    expect(projectedResult().x).toBeCloseTo(400, -1);
    expect(projectedResult().y).toBeCloseTo(300, -1);

    node.position.x = 2;
    await ctx.ticker.fastForwardFrames(1);
    expect(projectedResult().x).toBeGreaterThan(400);

    cleanup();
  });
});
