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
          <FPSCamera ref={(c) => (camRef = c)} moveSpeed={12} lookSpeed={0.005} />
        </View3D>
      </ctx.Provider>
    ));

    // THEN
    expect(camRef).toBeDefined();
    expect(camRef?.moveSpeed).toBe(12);
    expect(camRef?.lookSpeed).toBe(0.005);

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
});
