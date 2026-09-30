import type * as Pixi3D from "@pixi/3d";
import { cleanup, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Camera3D, View3D } from "../components";

describe("Camera3D component", () => {
  it("mounts Camera3D inside View3D and becomes the active camera declaratively", () => {
    let cameraRef: Pixi3D.Camera3D | undefined;

    const { container: view } = mountScene<Pixi3D.View3D>(() => (
      <View3D width={300} height={300}>
        <Camera3D ref={(c) => (cameraRef = c)} x={0} y={2.5} z={5} fov={45} />
      </View3D>
    ));

    expect(cameraRef).toBeDefined();
    expect(view.camera).toBe(cameraRef);
    expect(cameraRef?.x).toBe(0);
    expect(cameraRef?.y).toBe(2.5);
    expect(cameraRef?.z).toBe(5);
    expect(cameraRef?.fov).toBe(45);

    cleanup();
  });

  it("can switch active cameras reactively", () => {
    const [activeCam, setActiveCam] = createSignal<1 | 2>(1);
    let cam1: Pixi3D.Camera3D | undefined;
    let cam2: Pixi3D.Camera3D | undefined;

    const { container: view } = mountScene<Pixi3D.View3D>(() => (
      <View3D width={300} height={300}>
        <Camera3D ref={(c) => (cam1 = c)} label="cam1" active={activeCam() === 1} x={10} />
        <Camera3D ref={(c) => (cam2 = c)} label="cam2" active={activeCam() === 2} x={20} />
      </View3D>
    ));

    expect(view.camera).toBe(cam1);

    setActiveCam(2);
    expect(view.camera).toBe(cam2);

    cleanup();
  });

  it("throws an error if Camera3D is rendered outside a View3D", () => {
    expect(() => {
      mountScene(() => <Camera3D x={10} />);
    }).toThrow(
      "useView3D must be used within a <View3D>, <View3DProvider>, or a component mounted inside one.",
    );

    cleanup();
  });
});
