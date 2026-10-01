import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { Container3D, OrbitCamera, View3D } from "../components";

describe("OrbitCamera component", () => {
  it("mounts OrbitCamera inside View3D and responds to props", () => {
    let orbitRef: any;
    const [enabled, setEnabled] = createSignal(true);
    const [minDist, setMinDist] = createSignal(2);

    mountScene(() => (
      <View3D width={300} height={300}>
        <OrbitCamera
          ref={(c) => (orbitRef = c)}
          enabled={enabled()}
          minDistance={minDist()}
          maxDistance={50}
        />
        <Container3D label="target" />
      </View3D>
    ));

    expect(orbitRef).toBeDefined();
    expect(orbitRef?.enabled).toBe(true);
    expect(orbitRef?.minDistance).toBe(2);
    expect(orbitRef?.maxDistance).toBe(50);

    setEnabled(false);
    expect(orbitRef?.enabled).toBe(false);

    setMinDist(10);
    expect(orbitRef?.minDistance).toBe(10);

    cleanup();
  });

  it("binds to context ticker instead of Ticker.shared and updates on ticker advance", async () => {
    const ctx = createTestContext();
    let orbitRef: any;

    mountScene(() => (
      <ctx.Provider>
        <View3D width={300} height={300}>
          <OrbitCamera ref={(c) => (orbitRef = c)} autoRotate={true} autoRotateSpeed={2} />
        </View3D>
      </ctx.Provider>
    ));

    expect(orbitRef).toBeDefined();
    if (!orbitRef) return;

    // Engine's internal autoUpdate should be false (not registered on Ticker.shared)
    expect(orbitRef.autoUpdate).toBe(false);

    // Spy on controller update method
    const updateSpy = vi.spyOn(orbitRef, "update");

    // Advance manual ticker by 1 frame
    await ctx.ticker.fastForwardFrames(1);

    expect(updateSpy).toHaveBeenCalled();

    cleanup();
  });

  it("listens to onchange, onstart, onend events", () => {
    let orbitRef: any;
    const onChange = vi.fn();
    const onStart = vi.fn();
    const onEnd = vi.fn();

    mountScene(() => (
      <View3D width={300} height={300}>
        <OrbitCamera
          ref={(c) => (orbitRef = c)}
          onchange={onChange}
          onstart={onStart}
          onend={onEnd}
        />
      </View3D>
    ));

    expect(orbitRef).toBeDefined();
    if (!orbitRef) return;

    orbitRef.emit("start");
    expect(onStart).toHaveBeenCalledTimes(1);

    orbitRef.emit("change");
    expect(onChange).toHaveBeenCalledTimes(1);

    orbitRef.emit("end");
    expect(onEnd).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
