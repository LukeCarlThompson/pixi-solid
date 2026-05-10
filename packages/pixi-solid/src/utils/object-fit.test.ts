import type { Container } from "pixi.js";
import { describe, expect, it } from "vitest";

import { objectFit } from "./object-fit";

type MockContainer = {
  x: number;
  y: number;
  width: number;
  height: number;
  getLocalBounds: () => { x: number; y: number; width: number; height: number };
  scale: {
    x: number;
    y: number;
    set: (x: number, y: number) => void;
  };
};

const createMockContainer = (
  naturalWidth: number,
  naturalHeight: number,
  localX = 0,
  localY = 0,
): MockContainer => {
  const container: MockContainer = {
    x: 0,
    y: 0,
    width: naturalWidth,
    height: naturalHeight,
    getLocalBounds: () => ({
      x: localX,
      y: localY,
      width: naturalWidth,
      height: naturalHeight,
    }),
    scale: {
      x: 1,
      y: 1,
      set: (x: number, y: number) => {
        container.scale.x = x;
        container.scale.y = y;
        container.width = naturalWidth * x;
        container.height = naturalHeight * y;
      },
    },
  };

  return container;
};

describe("objectFit", () => {
  it("GIVEN no position WHEN fitting THEN it defaults to centered alignment", () => {
    const object = createMockContainer(100, 100) as unknown as Container;

    objectFit(object, { width: 300, height: 150 }, "contain");

    expect(object.scale.x).toBeCloseTo(1.5);
    expect(object.scale.y).toBeCloseTo(1.5);
    expect(object.x).toBeCloseTo(75);
    expect(object.y).toBeCloseTo(0);
  });

  it("GIVEN top-left position WHEN fitting THEN it aligns to the top-left corner", () => {
    const object = createMockContainer(100, 100) as unknown as Container;

    objectFit(object, { width: 300, height: 150 }, "cover", "top-left");

    expect(object.scale.x).toBeCloseTo(3);
    expect(object.scale.y).toBeCloseTo(3);
    expect(object.x).toBeCloseTo(0);
    expect(object.y).toBeCloseTo(0);
  });

  it("GIVEN bottom-right position with none fit WHEN fitting THEN it anchors without scaling", () => {
    const object = createMockContainer(100, 100) as unknown as Container;

    objectFit(object, { width: 300, height: 150 }, "none", "bottom-right");

    expect(object.scale.x).toBeCloseTo(1);
    expect(object.scale.y).toBeCloseTo(1);
    expect(object.x).toBeCloseTo(200);
    expect(object.y).toBeCloseTo(50);
  });

  it("GIVEN normalized x and y WHEN fitting THEN it aligns proportionally", () => {
    const object = createMockContainer(100, 100) as unknown as Container;

    objectFit(object, { width: 300, height: 150 }, "contain", { x: 0.25, y: 0.5 });

    expect(object.x).toBeCloseTo(37.5);
    expect(object.y).toBeCloseTo(0);
  });

  it("GIVEN local bounds offset WHEN fitting THEN it compensates for local origin", () => {
    const object = createMockContainer(100, 50, -50, -25) as unknown as Container;

    objectFit(object, { width: 500, height: 300 }, "contain", "center");

    expect(object.scale.x).toBeCloseTo(5);
    expect(object.scale.y).toBeCloseTo(5);
    expect(object.x).toBeCloseTo(250);
    expect(object.y).toBeCloseTo(150);
  });
});
