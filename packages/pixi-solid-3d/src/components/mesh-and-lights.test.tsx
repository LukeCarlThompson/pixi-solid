import type * as Pixi3D from "@pixi/3d";
import {
  CubeGeometry as PixiCubeGeometry,
  FlatMaterial as PixiFlatMaterial,
  Material3D as PixiMaterial3D,
  PlaneGeometry as PixiPlaneGeometry,
} from "@pixi/3d";
import { PortalMaterial as PixiPortalMaterial } from "@pixi/3d/extras";
import { cleanup, mountScene } from "pixi-solid/testing";
import { RenderTexture } from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import {
  Mesh3D,
  DirectionalLight,
  CubeGeometry,
  Material3D,
  PhongMaterial,
  PortalMaterial,
  ToonMaterial,
} from "../components";

describe("Mesh3D and Lights", () => {
  it("GIVEN geometry, material and shadow props WHEN a Mesh3D mounts THEN it carries them", () => {
    // GIVEN
    const geometry = new PixiCubeGeometry();
    const material = new PixiMaterial3D();

    // WHEN
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

    // THEN
    expect(container.label).toBe("cube");
    expect(container.castShadow).toBe(true);
    expect(container.receiveShadow).toBe(true);
    expect(container.x).toBe(1);
    expect(container.y).toBe(2);
    expect(container.z).toBe(3);

    cleanup();
  });

  it("GIVEN signals bound to light props WHEN they change THEN the light follows", () => {
    // GIVEN
    const [intensity, setIntensity] = createSignal(1);
    const [color, setColor] = createSignal(0xffffff);

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight label="sun" intensity={intensity()} color={color()} castShadow={true} />
    ));

    expect(container.intensity).toBe(1);
    expect(container.color.toNumber()).toBe(0xffffff);
    expect(container.castShadow).toBe(true);

    // WHEN
    setIntensity(5);

    // THEN
    expect(container.intensity).toBe(5);

    // WHEN
    setColor(0xff0000);

    // THEN
    expect(container.color.toNumber()).toBe(0xff0000);

    cleanup();
  });

  it("GIVEN a lookAt signal WHEN the target moves THEN the light turns to face it", () => {
    // GIVEN
    const [target, setTarget] = createSignal({ x: 0, y: 0, z: 0 });

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight label="sun" x={0} y={10} z={0} lookAt={target()} />
    ));

    const initialQuatX = container.quaternion.x;

    // WHEN
    setTarget({ x: 0, y: 0, z: 10 });

    // THEN
    expect(container.quaternion.x).not.toBe(initialQuatX);

    cleanup();
  });

  it("GIVEN single-axis lookAt props WHEN one axis changes THEN the light turns without a new object", () => {
    // GIVEN
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

    // WHEN
    setTargetZ(15);

    // THEN
    expect(container.quaternion.x).not.toBe(initialQuatX);

    cleanup();
  });

  it("GIVEN a nested CubeGeometry and Material3D WHEN the mesh unmounts THEN both are disposed", () => {
    // GIVEN
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

    // WHEN
    setRoughness(0.85);

    // THEN
    expect(capturedMat?.roughness).toBeCloseTo(0.85, 2);
    expect(capturedMesh?.material).toBe(capturedMat);

    // WHEN
    cleanup();

    // THEN
    expect(capturedGeom._destroyed).toBe(true);
    expect(capturedMat.destroyed).toBe(true);
  });

  it("GIVEN a nested ToonMaterial WHEN its bands change THEN it re-shades and disposes on unmount", () => {
    // GIVEN
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

    // WHEN
    setBands(5);

    // THEN
    expect(capturedMat.data.bands).toBe(5);

    // WHEN
    cleanup();

    // THEN
    expect(capturedMat.destroyed).toBe(true);
  });

  it("GIVEN a nested PhongMaterial WHEN its shininess changes THEN it updates and disposes on unmount", () => {
    // GIVEN
    let capturedMat: any;
    const [shininess, setShininess] = createSignal(20);

    mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D>
        <CubeGeometry />
        <PhongMaterial
          ref={(m) => (capturedMat = m)}
          specularColor={0xffffff}
          shininess={shininess()}
        />
      </Mesh3D>
    ));

    expect(capturedMat).toBeDefined();
    expect(capturedMat.data.shininess).toBe(20);

    // WHEN
    setShininess(80);

    // THEN
    expect(capturedMat.data.shininess).toBe(80);

    // WHEN
    cleanup();

    // THEN
    expect(capturedMat.destroyed).toBe(true);
  });

  it("GIVEN an oncontextmenu handler WHEN the event fires THEN the handler runs", () => {
    // GIVEN
    const onContextMenu = vi.fn();

    const { container } = mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D label="panel" oncontextmenu={onContextMenu} />
    ));

    // WHEN
    container.emit("contextmenu", {} as Pixi3D.Pointer3DEvent);

    // THEN
    expect(onContextMenu).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("GIVEN an onpointerdowncapture handler WHEN the capture event fires THEN the handler runs", () => {
    // GIVEN
    const onPointerDownCapture = vi.fn();

    const { container } = mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D label="panel" onpointerdowncapture={onPointerDownCapture} />
    ));

    // WHEN
    container.emit("pointerdowncapture", {} as Pixi3D.Pointer3DEvent);

    // THEN
    expect(onPointerDownCapture).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("GIVEN a bare Mesh3D WHEN it unmounts THEN its fallback geometry and material are freed", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.Mesh3D>(() => <Mesh3D label="bare" />);

    const geometry = container.geometry as unknown as { _destroyed: boolean };
    const material = container.material;

    expect(container.geometry).toBeInstanceOf(PixiPlaneGeometry);
    expect(material).toBeInstanceOf(PixiFlatMaterial);

    // WHEN
    cleanup();

    // THEN
    expect(geometry._destroyed).toBe(true);
    expect(material.destroyed).toBe(true);
  });

  it("GIVEN supplied geometry and material WHEN the mesh unmounts THEN both stay alive", () => {
    // GIVEN
    const geometry = new PixiCubeGeometry();
    const material = new PixiMaterial3D();

    const { container } = mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D label="shared" geometry={geometry} material={material} />
    ));

    expect(container.geometry).toBe(geometry);
    expect(container.material).toBe(material);

    // WHEN
    cleanup();

    // THEN
    expect((geometry as unknown as { _destroyed: boolean })._destroyed).toBeFalsy();
    expect(material.destroyed).toBe(false);
  });

  it("GIVEN a spread props object WHEN it gains an option key THEN that option is applied", () => {
    // GIVEN
    const [spread, setSpread] = createSignal<Record<string, unknown>>({ label: "sun" });

    const { container } = mountScene<Pixi3D.DirectionalLight>(() => (
      <DirectionalLight {...spread()} />
    ));

    expect(container.intensity).toBe(1);

    // WHEN — `intensity` is an option, not a runtime prop, and was absent at mount
    setSpread({ label: "sun", intensity: 4 });

    // THEN
    expect(container.intensity).toBe(4);

    cleanup();
  });

  it("GIVEN a nested PortalMaterial WHEN it mounts THEN it shows the render texture and disposes on unmount", () => {
    // GIVEN
    let capturedMat: any;
    const feed = RenderTexture.create({ width: 64, height: 64 });

    mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D>
        <CubeGeometry />
        <PortalMaterial ref={(m) => (capturedMat = m)} texture={feed} baseColor={0xbfdcff} />
      </Mesh3D>
    ));

    // THEN
    expect(capturedMat).toBeInstanceOf(PixiPortalMaterial);
    expect(capturedMat.textures.portal).toBe(feed);

    // WHEN
    cleanup();

    // THEN
    expect(capturedMat.destroyed).toBe(true);
    feed.destroy(true);
  });
});
