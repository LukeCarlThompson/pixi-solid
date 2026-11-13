import type * as Pixi3D from "@pixi/3d";
import { cleanup, getByLabel, mountScene } from "pixi-solid/testing";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { Container3D, PointLight } from "../components";

describe("Container3D component", () => {
  it("GIVEN position and scale props WHEN it mounts THEN the container and its child carry them", () => {
    // GIVEN / WHEN
    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="root" x={10} y={20} z={30} scale={2}>
        <Container3D label="child" x={5} />
      </Container3D>
    ));

    // THEN
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

  it("GIVEN signals bound to coordinates WHEN they change THEN the container follows", () => {
    // GIVEN
    const [x, setX] = createSignal(0);
    const [scaleZ, setScaleZ] = createSignal(1);

    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="test" x={x()} scaleZ={scaleZ()} />
    ));

    expect(container.x).toBe(0);
    expect(container.scale.z).toBe(1);

    // WHEN
    setX(42);

    // THEN
    expect(container.x).toBe(42);

    // WHEN
    setScaleZ(3.5);

    // THEN
    expect(container.scale.z).toBe(3.5);

    cleanup();
  });

  it("GIVEN a conditionally rendered light WHEN it toggles THEN the child is added and removed", () => {
    // GIVEN
    const [showLight, setShowLight] = createSignal(false);

    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="root">
        {showLight() && <PointLight label="sun" intensity={10} />}
      </Container3D>
    ));

    expect(container.children.length).toBe(0);

    // WHEN
    setShowLight(true);

    // THEN
    expect(container.children.length).toBe(1);
    expect(container.children[0].label).toBe("sun");
    const sun = getByLabel<Pixi3D.PointLight>(container, "sun");
    expect(sun.intensity).toBe(10);

    // WHEN
    setShowLight(false);

    // THEN
    expect(container.children.length).toBe(0);

    cleanup();
  });

  it("GIVEN an event handler WHEN the children change THEN the handler still fires exactly once", () => {
    // GIVEN
    const onClick = vi.fn();
    const [showChild, setShowChild] = createSignal(true);

    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="root" onclick={onClick}>
        {showChild() && <Container3D label="child" />}
      </Container3D>
    ));

    container.emit("click", {} as Pixi3D.Pointer3DEvent);
    expect(onClick).toHaveBeenCalledTimes(1);

    // WHEN
    setShowChild(false);
    container.emit("click", {} as Pixi3D.Pointer3DEvent);

    // THEN
    expect(onClick).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it("GIVEN a spread props object WHEN it gains a key THEN the new prop is applied", () => {
    // GIVEN
    const [spread, setSpread] = createSignal<Record<string, unknown>>({ label: "root" });

    const { container } = mountScene<Pixi3D.Container3D>(() => <Container3D {...spread()} />);

    expect(container.label).toBe("root");
    expect(container.x).toBe(0);

    // WHEN — the spread object is replaced, so the key set grows
    setSpread({ label: "root", x: 42 });

    // THEN
    expect(container.x).toBe(42);

    cleanup();
  });

  it("GIVEN a spread props object WHEN an existing key changes THEN the prop is updated", () => {
    // GIVEN
    const [spread, setSpread] = createSignal<Record<string, unknown>>({ label: "root", x: 1 });

    const { container } = mountScene<Pixi3D.Container3D>(() => <Container3D {...spread()} />);

    expect(container.x).toBe(1);

    // WHEN
    setSpread({ label: "root", x: 7 });

    // THEN
    expect(container.x).toBe(7);

    cleanup();
  });
});
