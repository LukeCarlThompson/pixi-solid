import { Container } from "pixi.js";
import { describe, expect, it } from "vitest";

import { getAllByLabel, getByLabel, queryByLabel } from "./query-by-label";

const makeTree = () => {
  const root = new Container({ label: "scene" });
  const group = new Container({ label: "group" });
  const player = new Container({ label: "player" });
  const enemyA = new Container({ label: "enemy" });
  const enemyB = new Container({ label: "enemy" });

  root.addChild(group);
  group.addChild(player);
  group.addChild(enemyA);
  root.addChild(enemyB);

  return { root, group, player, enemyA, enemyB };
};

describe("queryByLabel", () => {
  it("GIVEN a nested scene WHEN querying a descendant label THEN it finds that node", () => {
    // GIVEN
    const { root, player } = makeTree();

    // WHEN
    const found = queryByLabel(root, "player");

    // THEN
    expect(found).toBe(player);
  });

  it("GIVEN a root that carries the label WHEN queried THEN the root itself is returned", () => {
    // GIVEN
    const { root } = makeTree();

    // WHEN / THEN
    expect(queryByLabel(root, "scene")).toBe(root);
  });

  it("GIVEN a missing label WHEN queried THEN it returns undefined", () => {
    // GIVEN
    const { root } = makeTree();

    // WHEN / THEN
    expect(queryByLabel(root, "boss")).toBeUndefined();
  });

  it("GIVEN a ref that was never assigned WHEN queried THEN it returns undefined instead of throwing", () => {
    // GIVEN a ref with no value yet, which is what an unassigned ref holds
    const unassignedRef: Container | undefined = undefined;

    // WHEN / THEN
    expect(queryByLabel(unassignedRef, "player")).toBeUndefined();
    expect(queryByLabel(null, "player")).toBeUndefined();
  });

  it("GIVEN a node with a `root` property WHEN queried THEN only `children` is walked", () => {
    // GIVEN a 2D container that happens to expose a `root` object, as a View3D does
    const { root } = makeTree();
    const decoy = new Container({ label: "hidden" });
    (root as unknown as { root: Container }).root = decoy;

    // WHEN
    const found = queryByLabel(root, "hidden");

    // THEN the walk follows `children` only; 3D structure is not guessed
    expect(found).toBeUndefined();
  });
});

describe("getByLabel", () => {
  it("GIVEN a present label WHEN queried THEN it returns the node", () => {
    // GIVEN
    const { root, group } = makeTree();

    // WHEN / THEN
    expect(getByLabel(root, "group")).toBe(group);
  });

  it("GIVEN a missing label WHEN queried THEN it throws naming the label", () => {
    // GIVEN
    const { root } = makeTree();

    // WHEN / THEN
    expect(() => getByLabel(root, "boss")).toThrow('getByLabel: no node with label "boss"');
  });

  it("GIVEN an unassigned ref WHEN queried THEN it throws naming the missing root", () => {
    // GIVEN a ref with no value yet, which is what an unassigned ref holds
    const unassignedRef: Container | undefined = undefined;

    // WHEN / THEN
    expect(() => getByLabel(unassignedRef, "player")).toThrow("getByLabel: root is undefined");
    expect(() => getByLabel(null, "player")).toThrow("getByLabel: root is null");
  });
});

describe("getAllByLabel", () => {
  it("GIVEN repeated labels WHEN queried THEN every match comes back in depth-first order", () => {
    // GIVEN
    const { root, enemyA, enemyB } = makeTree();

    // WHEN
    const found = getAllByLabel(root, "enemy");

    // THEN
    expect(found).toEqual([enemyA, enemyB]);
  });

  it("GIVEN a missing label WHEN queried THEN it returns an empty array", () => {
    // GIVEN
    const { root } = makeTree();

    // WHEN / THEN
    expect(getAllByLabel(root, "boss")).toEqual([]);
  });

  it("GIVEN an unassigned ref WHEN queried THEN it throws naming the missing root", () => {
    // GIVEN a ref with no value yet, which is what an unassigned ref holds
    const unassignedRef: Container | undefined = undefined;

    // WHEN / THEN
    expect(() => getAllByLabel(unassignedRef, "enemy")).toThrow("getAllByLabel: root is undefined");
  });
});
