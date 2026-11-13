import type * as Pixi3DExtras from "@pixi/3d/extras";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { FPSCamera, ParticleSystem3D, View3D } from "../components";

describe("FPSCamera and ParticleSystem3D extras", () => {
  it("GIVEN an FPSCamera inside a View3D WHEN it mounts THEN it takes its movement props", () => {
    // GIVEN
    const ctx = createTestContext();
    let camRef: Pixi3DExtras.FPSCamera | undefined;

    // WHEN
    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <FPSCamera
            ref={(c) => (camRef = c)}
            moveSpeed={12}
            lookSpeed={0.005}
            pointerLock={false}
            keyboard={false}
          />
        </View3D>
      </ctx.Provider>
    ));

    // THEN
    expect(camRef).toBeDefined();
    expect(camRef?.moveSpeed).toBe(12);
    expect(camRef?.lookSpeed).toBe(0.005);
    expect(camRef?.pointerLock).toBe(false);
    expect(camRef?.keyboard).toBe(false);

    cleanup();
  });

  it("GIVEN pointerLock and keyboard signals WHEN they change THEN the camera follows", () => {
    // GIVEN
    const ctx = createTestContext();
    let camRef: Pixi3DExtras.FPSCamera | undefined;
    const [pointerLock, setPointerLock] = createSignal(true);
    const [keyboard, setKeyboard] = createSignal(true);

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <FPSCamera ref={(c) => (camRef = c)} pointerLock={pointerLock()} keyboard={keyboard()} />
        </View3D>
      </ctx.Provider>
    ));

    expect(camRef?.pointerLock).toBe(true);
    expect(camRef?.keyboard).toBe(true);

    // WHEN
    setPointerLock(false);
    setKeyboard(false);

    // THEN
    expect(camRef?.pointerLock).toBe(false);
    expect(camRef?.keyboard).toBe(false);

    cleanup();
  });

  it("GIVEN an emitRate signal WHEN it changes THEN the particle system follows and ticks", async () => {
    // GIVEN
    const ctx = createTestContext();
    let psRef: Pixi3DExtras.ParticleSystem3D | undefined;
    const [rate, setRate] = createSignal(20);

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <ParticleSystem3D ref={(ps) => (psRef = ps)} capacity={500} emitRate={rate()} />
        </View3D>
      </ctx.Provider>
    ));

    expect(psRef).toBeDefined();
    expect(psRef?.capacity).toBe(500);
    expect(psRef?.emitRate).toBe(20);

    // WHEN
    setRate(50);

    // THEN
    expect(psRef?.emitRate).toBe(50);

    // WHEN
    await ctx.ticker.fastForwardFrames(2);

    // THEN
    expect(psRef?.destroyed).toBe(false);

    cleanup();
  });

  it("GIVEN gravity, drag and frameRate signals WHEN they change THEN the system follows each one", () => {
    // GIVEN
    const ctx = createTestContext();
    let psRef: Pixi3DExtras.ParticleSystem3D | undefined;
    const [gravity, setGravity] = createSignal<number | { x: number; y: number; z: number }>(9.8);
    const [drag, setDrag] = createSignal(0.5);
    const [frameRate, setFrameRate] = createSignal(12);

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <ParticleSystem3D
            ref={(ps) => (psRef = ps)}
            capacity={64}
            gravity={gravity()}
            drag={drag()}
            frameRate={frameRate()}
          />
        </View3D>
      </ctx.Provider>
    ));

    // THEN the constructor took the initial values
    expect(psRef?.drag).toBe(0.5);
    expect(psRef?.frameRate).toBe(12);
    expect(psRef?.gravity?.y).toBe(-9.8);

    // WHEN
    setGravity({ x: 1.5, y: -2, z: 0 });
    setDrag(3);
    setFrameRate(24);

    // THEN the prop binder wrote each one through
    expect(psRef?.gravity?.x).toBe(1.5);
    expect(psRef?.gravity?.y).toBe(-2);
    expect(psRef?.drag).toBe(3);
    expect(psRef?.frameRate).toBe(24);

    cleanup();
  });

  it("GIVEN a playing signal WHEN it flips THEN the system plays and stops", () => {
    // GIVEN
    const ctx = createTestContext();
    let psRef: Pixi3DExtras.ParticleSystem3D | undefined;
    const [playing, setPlaying] = createSignal(true);

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <ParticleSystem3D ref={(ps) => (psRef = ps)} capacity={64} playing={playing()} />
        </View3D>
      </ctx.Provider>
    ));

    // THEN
    expect(psRef?.playing).toBe(true);

    // WHEN
    setPlaying(false);

    // THEN
    expect(psRef?.playing).toBe(false);

    // WHEN
    setPlaying(true);

    // THEN
    expect(psRef?.playing).toBe(true);

    cleanup();
  });
});

describe("ParticleSystem3D lifecycle", () => {
  it("GIVEN a mounted system WHEN it unmounts THEN the component destroys it", () => {
    // GIVEN
    const ctx = createTestContext();
    let system: Pixi3DExtras.ParticleSystem3D | undefined;

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <ParticleSystem3D capacity={64} ref={(c) => (system = c)} />
        </View3D>
      </ctx.Provider>
    ));

    expect(system).toBeDefined();

    // WHEN
    cleanup();

    // THEN
    expect(system?.destroyed).toBe(true);
  });
});
