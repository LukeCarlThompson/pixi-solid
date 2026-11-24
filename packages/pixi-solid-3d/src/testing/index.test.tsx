import type * as Pixi3D from "@pixi/3d";
import { Container } from "pixi-solid";
import { cleanup, mountScene } from "pixi-solid/testing";
import { describe, expect, it } from "vitest";

import { Container3D, PointLight, View3D } from "../components";

import { getAllByLabel3D, getByLabel3D, queryByLabel3D } from "./index";

describe("queryByLabel3D", () => {
  it("GIVEN a View3D WHEN querying a nested 3D label THEN it walks view.root", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => (
      <View3D>
        <Container3D label="group">
          <PointLight label="sun" intensity={2} />
        </Container3D>
      </View3D>
    ));

    // WHEN
    const sun = queryByLabel3D<Pixi3D.PointLight>(container, "sun");

    // THEN
    expect(sun?.label).toBe("sun");
    expect(sun?.intensity).toBe(2);

    cleanup();
  });

  it("GIVEN a Container3D WHEN querying its subtree THEN it finds descendants", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.Container3D>(() => (
      <Container3D label="outer">
        <Container3D label="inner">
          <PointLight label="lamp" />
        </Container3D>
      </Container3D>
    ));

    // WHEN
    const lamp = queryByLabel3D(container, "lamp");

    // THEN
    expect(lamp).toBe(container.children[0].children[0]);

    cleanup();
  });

  it("GIVEN a missing label or an unassigned ref WHEN querying THEN it returns undefined", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => <View3D />);

    // WHEN / THEN
    expect(queryByLabel3D(container, "missing")).toBeUndefined();
    expect(queryByLabel3D(undefined, "missing")).toBeUndefined();
    expect(queryByLabel3D(null, "missing")).toBeUndefined();

    cleanup();
  });

  it("GIVEN a labelled View3D used as the root WHEN querying THEN the view matches its own label", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => (
      <View3D label="main-view">
        <Container3D label="crate" />
      </View3D>
    ));

    // WHEN / THEN
    expect(queryByLabel3D(container, "main-view")).toBe(container);
    expect(queryByLabel3D(container, "crate")?.label).toBe("crate");

    cleanup();
  });

  it("GIVEN a mixed 2D and 3D scene WHEN querying labels THEN it finds nodes in both graphs", () => {
    // GIVEN
    const { container } = mountScene(() => (
      <Container label="hud">
        <Container label="score" />
        <View3D>
          <Container3D label="crate" />
        </View3D>
      </Container>
    ));

    // WHEN / THEN
    expect(queryByLabel3D(container, "score")?.label).toBe("score");
    expect(queryByLabel3D(container, "crate")?.label).toBe("crate");

    cleanup();
  });
});

describe("getByLabel3D", () => {
  it("GIVEN a present label WHEN querying THEN it returns the node", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => (
      <View3D>
        <Container3D label="crate" />
      </View3D>
    ));

    // WHEN / THEN
    expect(getByLabel3D(container, "crate").label).toBe("crate");

    cleanup();
  });

  it("GIVEN a missing label WHEN querying THEN it throws naming the label", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => <View3D />);

    // WHEN / THEN
    expect(() => getByLabel3D(container, "missing")).toThrow(
      'getByLabel3D: no node with label "missing"',
    );

    cleanup();
  });

  it("GIVEN an unassigned ref WHEN querying THEN it throws naming the missing root", () => {
    // GIVEN a ref with no value yet, which is what an unassigned ref holds
    const unassignedRef: Pixi3D.View3D | undefined = undefined;

    // WHEN / THEN
    expect(() => getByLabel3D(unassignedRef, "crate")).toThrow("getByLabel3D: root is undefined");
    expect(() => getByLabel3D(null, "crate")).toThrow("getByLabel3D: root is null");
  });
});

describe("getAllByLabel3D", () => {
  it("GIVEN repeated 3D labels WHEN querying THEN every match comes back in depth-first order", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => (
      <View3D>
        <Container3D label="group">
          <Container3D label="enemy" />
          <Container3D label="enemy" />
        </Container3D>
      </View3D>
    ));

    // WHEN
    const found = getAllByLabel3D(container, "enemy");

    // THEN
    const group = getByLabel3D(container, "group");
    expect(found).toHaveLength(2);
    expect(found).toEqual(group.children);

    cleanup();
  });

  it("GIVEN a mixed 2D and 3D scene WHEN querying repeated labels THEN matches from both graphs come back in depth-first order", () => {
    // GIVEN
    let view: Pixi3D.View3D | undefined;

    const { container } = mountScene(() => (
      <Container label="hud">
        <Container label="enemy" />
        <View3D ref={(el) => (view = el)}>
          <Container3D label="enemy" />
        </View3D>
      </Container>
    ));

    // WHEN
    const found = getAllByLabel3D(container, "enemy");

    // THEN the 2D sibling comes first, then the node inside the view's 3D scene
    expect(found.map((node) => node.label)).toEqual(["enemy", "enemy"]);
    expect(found[0]).toBe(container.children[0]);
    expect(found[1].parent).toBe(view?.root);

    cleanup();
  });

  it("GIVEN a missing label WHEN querying THEN it returns an empty array", () => {
    // GIVEN
    const { container } = mountScene<Pixi3D.View3D>(() => <View3D />);

    // WHEN / THEN
    expect(getAllByLabel3D(container, "missing")).toEqual([]);

    cleanup();
  });

  it("GIVEN an unassigned ref WHEN querying THEN it throws naming the missing root", () => {
    // WHEN / THEN
    expect(() => getAllByLabel3D(undefined, "enemy")).toThrow("getAllByLabel3D: root is undefined");
    expect(() => getAllByLabel3D(null, "enemy")).toThrow("getAllByLabel3D: root is null");
  });
});
