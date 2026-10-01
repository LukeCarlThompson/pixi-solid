import type * as Pixi3DExtras from "@pixi/3d/extras";
import { cleanup, createTestContext, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { FPSCamera, ParticleSystem3D, View3D } from "../components";

describe("FPSCamera and ParticleSystem3D extras", () => {
  it("mounts FPSCamera and binds to context ticker", () => {
    const ctx = createTestContext();
    let camRef: Pixi3DExtras.FPSCamera | undefined;

    mountScene(() => (
      <ctx.Provider>
        <View3D width={400} height={300}>
          <FPSCamera ref={(c) => (camRef = c)} moveSpeed={12} lookSpeed={0.005} />
        </View3D>
      </ctx.Provider>
    ));

    expect(camRef).toBeDefined();
    expect(camRef?.moveSpeed).toBe(12);
    expect(camRef?.lookSpeed).toBe(0.005);

    cleanup();
  });

  it("mounts ParticleSystem3D and binds to context ticker", async () => {
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

    setRate(50);
    expect(psRef?.emitRate).toBe(50);

    await ctx.ticker.fastForwardFrames(2);

    cleanup();
  });
});
