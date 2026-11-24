import { ParticleContainer3D as PixiParticleContainer3D } from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { Texture } from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { ParticleContainer3D } from "../components";

describe("ParticleContainer3D component", () => {
  it("GIVEN capacity, texture and blend props WHEN it mounts THEN it carries them", () => {
    // GIVEN / WHEN
    const { container } = mountScene<PixiParticleContainer3D>(() => (
      <ParticleContainer3D
        label="sparks"
        capacity={16}
        texture={Texture.WHITE}
        blendMode="add"
        billboard="spherical"
        x={1}
        y={2}
        z={3}
      />
    ));

    // THEN
    expect(container).toBeInstanceOf(PixiParticleContainer3D);
    expect(container.capacity).toBe(16);
    expect(container.blendMode).toBe("add");
    // `billboardMode` is always `'none'` on a particle container: the quads orient themselves from
    // the constructor-only `billboard` option, and the setter warns if you assign it.
    expect(container.billboardMode).toBe("none");
    expect(container.x).toBe(1);
    expect(container.y).toBe(2);
    expect(container.z).toBe(3);

    cleanup();
  });

  it("GIVEN a batch of slots WHEN a particle is written then cleared THEN neither call throws", () => {
    // GIVEN
    const { container } = mountScene<PixiParticleContainer3D>(() => (
      <ParticleContainer3D label="sparks" capacity={4} />
    ));

    // WHEN / THEN
    expect(() => container.setParticleAt(0, 0, 1, 0, 0.5, 0, 0xffffff, 1)).not.toThrow();
    expect(() => container.clear()).not.toThrow();

    cleanup();
  });

  it("GIVEN a blend mode signal WHEN it changes THEN the container follows", () => {
    // GIVEN
    const [blendMode, setBlendMode] = createSignal<"normal" | "add">("normal");

    const { container } = mountScene<PixiParticleContainer3D>(() => (
      <ParticleContainer3D label="sparks" capacity={4} blendMode={blendMode()} />
    ));

    expect(container.blendMode).toBe("normal");

    // WHEN
    setBlendMode("add");

    // THEN
    expect(container.blendMode).toBe("add");

    cleanup();
  });

  it("GIVEN an existing container adopted through as WHEN it unmounts THEN it is not destroyed", () => {
    // GIVEN
    const owned = new PixiParticleContainer3D({ capacity: 2, texture: Texture.WHITE });

    mountScene(() => <ParticleContainer3D as={owned} />);

    // WHEN
    cleanup();

    // THEN
    expect(owned.destroyed).toBe(false);

    owned.destroy();
  });
});

describe("ParticleContainer3D lifecycle", () => {
  it("GIVEN a mounted container WHEN it unmounts THEN the component destroys the instance it built", () => {
    // GIVEN
    let mounted: PixiParticleContainer3D | undefined;

    mountScene(() => <ParticleContainer3D capacity={4} ref={(c) => (mounted = c)} />);

    expect(mounted).toBeDefined();

    // WHEN
    cleanup();

    // THEN
    expect(mounted?.destroyed).toBe(true);
  });
});
