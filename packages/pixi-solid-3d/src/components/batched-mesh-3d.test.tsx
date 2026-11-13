import { BatchedMesh3D as PixiBatchedMesh3D, CubeGeometry, Material3D, Matrix4 } from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { BatchedMesh3D } from "../components";

describe("BatchedMesh3D component", () => {
  it("GIVEN the required size and transform props WHEN it mounts THEN it carries them", () => {
    // GIVEN / WHEN
    const { container } = mountScene<PixiBatchedMesh3D>(() => (
      <BatchedMesh3D label="forest" size={8} x={2} z={-1} />
    ));

    // THEN
    expect(container).toBeInstanceOf(PixiBatchedMesh3D);
    expect(container.size).toBe(8);
    expect(container.label).toBe("forest");
    expect(container.x).toBe(2);
    expect(container.z).toBe(-1);

    cleanup();
  });

  it("GIVEN slot contents written through the batch API WHEN a slot setting changes THEN invalidate applies it", () => {
    // GIVEN
    const geometry = new CubeGeometry();
    const material = new Material3D({ baseColor: 0x44aa88 });

    const { container } = mountScene<PixiBatchedMesh3D>(() => (
      <BatchedMesh3D
        label="boxes"
        size={2}
        ref={(batch) => {
          batch.setGeometryAt(0, geometry);
          batch.setMaterialAt(0, material);
          batch.setMatrixAt(0, new Matrix4());
        }}
      />
    ));

    expect(container.items[0].receiveShadow).toBe(true);

    // WHEN
    container.items[0].receiveShadow = false;
    container.invalidate(0);

    // THEN
    expect(container.items[0].receiveShadow).toBe(false);

    cleanup();
  });

  it("GIVEN a batch WHEN a slot is hidden and shown again THEN its visibility follows", () => {
    // GIVEN
    const { container } = mountScene<PixiBatchedMesh3D>(() => (
      <BatchedMesh3D label="boxes" size={4} />
    ));

    expect(container.getVisibleAt(1)).toBe(true);

    // WHEN
    container.setVisibleAt(1, false);

    // THEN
    expect(container.getVisibleAt(1)).toBe(false);

    // WHEN
    container.setVisibleAt(1, true);

    // THEN
    expect(container.getVisibleAt(1)).toBe(true);

    cleanup();
  });

  it("GIVEN instanceData declared in the options WHEN a field is written by name THEN it is accepted", () => {
    // GIVEN
    const { container } = mountScene<PixiBatchedMesh3D>(() => (
      <BatchedMesh3D
        label="boxes"
        size={2}
        instanceData={{ tint: { type: "vec4<f32>", value: [1, 1, 1, 1] } }}
      />
    ));

    // WHEN / THEN
    expect(() => container.setInstanceDataAt(0, "tint", 1, 0.2, 0.2, 1)).not.toThrow();

    cleanup();
  });

  it("GIVEN size is getter-only WHEN a signal changes it THEN the batch keeps its original size and warns", () => {
    // GIVEN
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const [size, setSize] = createSignal(2);

    const { container } = mountScene<PixiBatchedMesh3D>(() => (
      <BatchedMesh3D label="boxes" size={size()} />
    ));

    expect(container.size).toBe(2);

    // WHEN
    setSize(6);

    // THEN
    expect(container.size).toBe(2);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"size" is read-only'));

    warnSpy.mockRestore();
    cleanup();
  });

  it("GIVEN an existing batch adopted through as WHEN it unmounts THEN it is not destroyed", () => {
    // GIVEN
    const owned = new PixiBatchedMesh3D({ size: 2 });

    mountScene(() => <BatchedMesh3D as={owned} />);

    // WHEN
    cleanup();

    // THEN
    expect(owned.destroyed).toBe(false);

    owned.destroy();
  });
});
