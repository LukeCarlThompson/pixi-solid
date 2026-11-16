import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { Container3D, OrbitCamera, View3D } from "../components";

describe("OrbitCamera component", () => {
  it("GIVEN enabled and distance props WHEN they change THEN the controller follows", () => {
    // GIVEN
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

    // WHEN
    setEnabled(false);

    // THEN
    expect(orbitRef?.enabled).toBe(false);

    // WHEN
    setMinDist(10);

    // THEN
    expect(orbitRef?.minDistance).toBe(10);

    cleanup();
  });

  it("GIVEN an auto-rotating OrbitCamera WHEN the context ticker advances THEN it updates from that ticker", async () => {
    // GIVEN
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

    // The controller must not register itself on `Ticker.shared`.
    expect(orbitRef.autoUpdate).toBe(false);

    const updateSpy = vi.spyOn(orbitRef, "update");

    // WHEN
    await ctx.ticker.fastForwardFrames(1);

    // THEN
    expect(updateSpy).toHaveBeenCalled();

    cleanup();
  });

  it("GIVEN start, change and end handlers WHEN the controller emits THEN each handler runs", () => {
    // GIVEN
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

    // WHEN
    orbitRef.emit("start");

    // THEN
    expect(onStart).toHaveBeenCalledTimes(1);

    // WHEN
    orbitRef.emit("change");

    // THEN
    expect(onChange).toHaveBeenCalledTimes(1);

    // WHEN
    orbitRef.emit("end");

    // THEN
    expect(onEnd).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
