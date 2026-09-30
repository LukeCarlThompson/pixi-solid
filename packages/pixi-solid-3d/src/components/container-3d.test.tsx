import type * as Pixi3D from "@pixi/3d";
import { cleanup, getByLabel, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";

import { Container3D, PointLight } from "../components";

describe("Container3D component", () => {
  it("mounts a basic Container3D and binds initial position/scale", () => {
    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="root" x={10} y={20} z={30} scale={2}>
        <Container3D label="child" x={5} />
      </Container3D>
    ));

    expect(container.label).toBe("root");
    expect(container.x).toBe(10);
    expect(container.y).toBe(20);
    expect(container.z).toBe(30);
    expect(container.scale.x).toBe(2);
    expect(container.scale.y).toBe(2);
    expect(container.scale.z).toBe(2);

    const child = getByLabel<Pixi3D.Container3D>(container, "child");
    expect(child).toBeDefined();
    expect(child.x).toBe(5);

    cleanup();
  });

  it("updates 3D coordinates reactively with signals", () => {
    const [x, setX] = createSignal(0);
    const [scaleZ, setScaleZ] = createSignal(1);

    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="test" x={x()} scaleZ={scaleZ()} />
    ));

    expect(container.x).toBe(0);
    expect(container.scale.z).toBe(1);

    setX(42);
    expect(container.x).toBe(42);

    setScaleZ(3.5);
    expect(container.scale.z).toBe(3.5);

    cleanup();
  });

  it("adds and removes child 3D nodes reactively", () => {
    const [showLight, setShowLight] = createSignal(false);

    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="root">
        {showLight() && <PointLight label="sun" intensity={10} />}
      </Container3D>
    ));

    expect(container.children.length).toBe(0);

    setShowLight(true);
    expect(container.children.length).toBe(1);
    expect(container.children[0].label).toBe("sun");
    const sun = getByLabel<Pixi3D.PointLight>(container, "sun");
    expect(sun.intensity).toBe(10);

    setShowLight(false);
    expect(container.children.length).toBe(0);

    cleanup();
  });
});
