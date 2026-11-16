import type * as Pixi3D from "@pixi/3d";
import {
  CapsuleGeometry as PixiCapsuleGeometry,
  ConeGeometry as PixiConeGeometry,
  CubeGeometry as PixiCubeGeometry,
  CylinderGeometry as PixiCylinderGeometry,
  IcosahedronGeometry as PixiIcosahedronGeometry,
  PlaneGeometry as PixiPlaneGeometry,
  SphereGeometry as PixiSphereGeometry,
  TorusGeometry as PixiTorusGeometry,
  TorusKnotGeometry as PixiTorusKnotGeometry,
} from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { createSignal, type JSX } from "solid-js";
import { describe, expect, it } from "vitest";

import {
  CapsuleGeometry,
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Mesh3D,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
} from "../components";

/** `Geometry3D` keeps its destroyed flag private, so read it through a named shape. */
const isDestroyed = (geometry: Pixi3D.Geometry3D): boolean =>
  (geometry as unknown as { _destroyed: boolean })._destroyed;

/**
 * GIVEN a declarative geometry WHEN mounted inside a `Mesh3D` THEN it registers itself, builds real
 * vertices, and unmounting frees it.
 */
const expectManagedGeometry = (
  renderGeometry: () => JSX.Element,
  GeometryClass: abstract new (...args: any[]) => Pixi3D.Geometry3D,
): void => {
  const { container: mesh } = mountScene<Pixi3D.Mesh3D>(() => (
    <Mesh3D label="host">{renderGeometry()}</Mesh3D>
  ));

  const geometry = mesh.geometry;

  expect(geometry).toBeInstanceOf(GeometryClass);
  expect(geometry.vertexCount).toBeGreaterThan(0);

  cleanup();

  expect(isDestroyed(geometry)).toBe(true);
};

describe("declarative geometries", () => {
  it("GIVEN a CubeGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <CubeGeometry width={2} height={2} depth={2} />, PixiCubeGeometry);
  });

  it("GIVEN a PlaneGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <PlaneGeometry width={2} height={2} />, PixiPlaneGeometry);
  });

  it("GIVEN a SphereGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <SphereGeometry radius={1} />, PixiSphereGeometry);
  });

  it("GIVEN a CylinderGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(
      () => <CylinderGeometry radiusTop={1} radiusBottom={1} height={2} />,
      PixiCylinderGeometry,
    );
  });

  it("GIVEN a ConeGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <ConeGeometry radius={1} height={2} />, PixiConeGeometry);
  });

  it("GIVEN a CapsuleGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <CapsuleGeometry radius={0.5} height={1} />, PixiCapsuleGeometry);
  });

  it("GIVEN a TorusGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <TorusGeometry radius={1} tube={0.25} />, PixiTorusGeometry);
  });

  it("GIVEN a TorusKnotGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <TorusKnotGeometry radius={1} tube={0.2} />, PixiTorusKnotGeometry);
  });

  it("GIVEN an IcosahedronGeometry WHEN mounted in a Mesh3D THEN it is registered, filled and later destroyed", () => {
    expectManagedGeometry(() => <IcosahedronGeometry radius={1} />, PixiIcosahedronGeometry);
  });

  it("GIVEN a conditional nested geometry WHEN it unmounts THEN the mesh geometry is restored and the old one freed", () => {
    // GIVEN
    const [showSphere, setShowSphere] = createSignal(true);

    const { container: mesh } = mountScene<Pixi3D.Mesh3D>(() => (
      <Mesh3D label="host">{showSphere() && <SphereGeometry radius={1} />}</Mesh3D>
    ));

    const sphere = mesh.geometry;
    expect(sphere).toBeInstanceOf(PixiSphereGeometry);

    // WHEN
    setShowSphere(false);

    // THEN
    expect(mesh.geometry).not.toBe(sphere);
    expect(isDestroyed(sphere)).toBe(true);

    cleanup();
  });
});
