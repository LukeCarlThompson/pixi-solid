import type * as Pixi3D from "@pixi/3d";
import { CubeGeometry as PixiCubeGeometry, Material3D as PixiMaterial3D } from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Mesh3D, DirectionalLight, CubeGeometry, Material3D, ToonMaterial } from "../components";

describe("Mesh3D and Lights", () => {
  it("mounts Mesh3D with geometry and material", () => {
    const geometry = new PixiCubeGeometry();
    const material = new PixiMaterial3D();

    const { container } = mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D
        label="cube"
        geometry={geometry}
        material={material}
        castShadow={true}
        receiveShadow={true}
        x={1}
        y={2}
        z={3}
      />
    ));

    expect(container.label).toBe("cube");
    expect(container.castShadow).toBe(true);
    expect(container.receiveShadow).toBe(true);
    expect(container.x).toBe(1);
    expect(container.y).toBe(2);
    expect(container.z).toBe(3);

    cleanup();
  });

  it("mounts and updates light components reactively", () => {
    const [intensity, setIntensity] = createSignal(1);
    const [color, setColor] = createSignal(0xffffff);

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight label="sun" intensity={intensity()} color={color()} castShadow={true} />
    ));

    expect(container.intensity).toBe(1);
    expect(container.color.toNumber()).toBe(0xffffff);
    expect(container.castShadow).toBe(true);

    setIntensity(5);
    expect(container.intensity).toBe(5);

    setColor(0xff0000);
    expect(container.color.toNumber()).toBe(0xff0000);

    cleanup();
  });

  it("supports reactive lookAt prop on 3D containers and lights", () => {
    const [target, setTarget] = createSignal({ x: 0, y: 0, z: 0 });

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight label="sun" x={0} y={10} z={0} lookAt={target()} />
    ));

    const initialQuatX = container.quaternion.x;

    // Moving target forward should tilt quaternion orientation
    setTarget({ x: 0, y: 0, z: 10 });
    expect(container.quaternion.x).not.toBe(initialQuatX);

    cleanup();
  });

  it("supports granular lookAtX, lookAtY, lookAtZ without object recreation", () => {
    const [targetZ, setTargetZ] = createSignal(0);

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight
        label="sun"
        x={0}
        y={10}
        z={0}
        lookAtX={0}
        lookAtY={0}
        lookAtZ={targetZ()}
      />
    ));

    const initialQuatX = container.quaternion.x;

    setTargetZ(15);
    expect(container.quaternion.x).not.toBe(initialQuatX);

    cleanup();
  });

  it("supports declarative nested CubeGeometry and Material3D with automated disposal", () => {
    let capturedMesh: Pixi3D.Mesh3D | undefined;
    let capturedGeom: any;
    let capturedMat: any;
    const [roughness, setRoughness] = createSignal(0.2);

    mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D ref={(m) => (capturedMesh = m)} x={5}>
        <CubeGeometry ref={(g) => (capturedGeom = g)} width={2} height={2} depth={2} />
        <Material3D ref={(m) => (capturedMat = m)} baseColor={0x38bdf8} roughness={roughness()} />
      </Mesh3D>
    ));

    expect(capturedMesh).toBeDefined();
    expect(capturedMesh?.geometry).toBe(capturedGeom);
    expect(capturedMesh?.material).toBe(capturedMat);
    expect(capturedMat?.roughness).toBeCloseTo(0.2, 2);

    // Fine-grained update to material property without re-allocating
    setRoughness(0.85);
    expect(capturedMat?.roughness).toBeCloseTo(0.85, 2);
    expect(capturedMesh?.material).toBe(capturedMat);

    // Unmount and verify automatic disposal
    cleanup();
    expect(capturedGeom._destroyed).toBe(true);
    expect(capturedMat.destroyed).toBe(true);
  });

  it("supports declarative ToonMaterial", () => {
    let capturedMat: any;
    const [bands, setBands] = createSignal(3);

    mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D>
        <CubeGeometry />
        <ToonMaterial ref={(m) => (capturedMat = m)} bands={bands()} outline={true} />
      </Mesh3D>
    ));

    expect(capturedMat).toBeDefined();
    expect(capturedMat.data.bands).toBe(3);

    setBands(5);
    expect(capturedMat.data.bands).toBe(5);

    cleanup();
    expect(capturedMat.destroyed).toBe(true);
  });
});
