import { Container3D, Plane, Vector3 } from "@pixi/3d";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import {
  Camera3D,
  View3D,
  View3DProvider,
  useScreenToWorld,
  useWorldToScreen,
} from "../components";
import type { ScreenToWorldPoint, WorldToScreenResult } from "../components";

describe("3D projection hooks", () => {
  it("useWorldToScreen reactively projects 3D coordinates onto 2D screen", async () => {
    const ctx = createTestContext();
    const [pos, setPos] = createSignal({ x: 0, y: 0, z: 0 });
    let projectedResult: () => WorldToScreenResult = () => ({ x: 0, y: 0, visible: false });

    const TestComponent = () => {
      projectedResult = useWorldToScreen(pos);
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
    let projectedResult: () => WorldToScreenResult = () => ({ x: 0, y: 0, visible: false });

    const TestComponent = () => {
      projectedResult = useWorldToScreen(node);
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
    let unprojectedResult: () => ScreenToWorldPoint | null = () => null;

    const TestComponent = () => {
      unprojectedResult = useScreenToWorld(cursor, ground);
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
    let projectedResult: () => WorldToScreenResult = () => ({ x: 0, y: 0, visible: false });

    const SiblingHUD = () => {
      // Notice: no view passed, no ref passed!
      projectedResult = useWorldToScreen(node);
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3DProvider width={800} height={600}>
          {/* 3D Viewport */}
          <View3D>
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

  it("useWorldToScreen does not throw for a sibling declared before View3D", async () => {
    const ctx = createTestContext();
    const node = new Container3D();
    node.position.set(0, 0, 0);
    let projectedResult: () => WorldToScreenResult = () => ({ x: 0, y: 0, visible: false });

    const SiblingHUD = () => {
      projectedResult = useWorldToScreen(node);
      return null;
    };

    mountScene(() => (
      <ctx.Provider>
        <View3DProvider width={800} height={600}>
          {/* Sibling 2D component rendered BEFORE the viewport. The provider creates the
              View3D, so the view already exists and the hook resolves without throwing. */}
          <SiblingHUD />

          <View3D>
            <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          </View3D>
        </View3DProvider>
      </ctx.Provider>
    ));

    // The camera only exists once View3D has mounted, so the first projection happens on the
    // next tick rather than during setup.
    await ctx.ticker.fastForwardFrames(1);

    expect(projectedResult().visible).toBe(true);
    expect(projectedResult().x).toBeCloseTo(400, -1);

    cleanup();
  });

  it("useWorldToScreen throws when there is no View3D context", () => {
    expect(() => {
      mountScene(() => {
        const node = new Container3D();
        useWorldToScreen(node);
        return null;
      });
    }).toThrow(
      "useWorldToScreen must be used within a <View3D>, <View3DProvider>, or a component mounted inside one.",
    );

    cleanup();
  });

  it("useScreenToWorld throws when there is no View3D context", () => {
    expect(() => {
      mountScene(() => {
        const ground = new Plane(new Vector3(0, 1, 0), 0);
        useScreenToWorld({ x: 0, y: 0 }, ground);
        return null;
      });
    }).toThrow(
      "useScreenToWorld must be used within a <View3D>, <View3DProvider>, or a component mounted inside one.",
    );

    cleanup();
  });
});
