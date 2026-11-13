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
  it("GIVEN a 3D position signal WHEN it moves right THEN useWorldToScreen tracks it", async () => {
    // GIVEN
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
    expect(projectedResult().x).toBeCloseTo(400, -1);
    expect(projectedResult().y).toBeCloseTo(300, -1);

    // WHEN
    setPos({ x: 2, y: 0, z: 0 });
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(projectedResult().x).toBeGreaterThan(400);

    cleanup();
  });

  it("GIVEN a Container3D target WHEN it moves left THEN useWorldToScreen tracks it", async () => {
    // GIVEN
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

    // WHEN
    node.position.x = -2;
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(projectedResult().x).toBeLessThan(400);

    cleanup();
  });

  it("GIVEN a cursor signal over a ground plane WHEN it moves right THEN useScreenToWorld unprojects it", async () => {
    // GIVEN
    const ctx = createTestContext();
    const ground = new Plane(new Vector3(0, 1, 0), 0);
    const [cursor, setCursor] = createSignal({ x: 400, y: 300 });
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

    // WHEN
    setCursor({ x: 600, y: 300 });
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(unprojectedResult()?.x).toBeGreaterThan(0);

    cleanup();
  });

  it("GIVEN a 2D sibling inside View3DProvider WHEN the node moves THEN the hook resolves the shared view", async () => {
    // GIVEN
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
          <View3D>
            <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          </View3D>

          <SiblingHUD />
        </View3DProvider>
      </ctx.Provider>
    ));

    expect(projectedResult).toBeDefined();
    expect(projectedResult().visible).toBe(true);
    expect(projectedResult().x).toBeCloseTo(400, -1);
    expect(projectedResult().y).toBeCloseTo(300, -1);

    // WHEN
    node.position.x = 2;
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(projectedResult().x).toBeGreaterThan(400);

    cleanup();
  });

  it("GIVEN a sibling declared before View3D WHEN the first tick runs THEN it projects without throwing", async () => {
    // GIVEN
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
          <SiblingHUD />

          <View3D>
            <Camera3D x={0} y={0} z={10} lookAt={{ x: 0, y: 0, z: 0 }} />
          </View3D>
        </View3DProvider>
      </ctx.Provider>
    ));

    // WHEN — the camera only exists once View3D has mounted.
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(projectedResult().visible).toBe(true);
    expect(projectedResult().x).toBeCloseTo(400, -1);

    cleanup();
  });

  it("GIVEN no View3D context WHEN useWorldToScreen runs THEN it throws", () => {
    // GIVEN / WHEN / THEN
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

  it("GIVEN no View3D context WHEN useScreenToWorld runs THEN it throws", () => {
    // GIVEN / WHEN / THEN
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
