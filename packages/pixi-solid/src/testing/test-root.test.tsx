import type * as Pixi from "pixi.js";
import { onCleanup } from "solid-js";
import { describe, expect, it } from "vitest";

import { createManualTicker, getByLabel, mountTest, queryByLabel } from "./index";
import { Container } from "../components";

describe("testing helpers", () => {
  it("GIVEN setup throws in mountTest WHEN creating root THEN cleanup still runs", () => {
    let didCleanup = false;

    expect(() =>
      mountTest(() => {
        onCleanup(() => {
          didCleanup = true;
        });

        throw new Error("setup failed");
      }),
    ).toThrow("setup failed");

    expect(didCleanup).toBe(true);
  });

  it("GIVEN component throws in mountTest WHEN creating root THEN cleanup still runs", () => {
    let didCleanup = false;

    const ThrowingComponent = () => {
      onCleanup(() => {
        didCleanup = true;
      });

      throw new Error("render failed");
    };

    expect(() => mountTest(() => <ThrowingComponent />)).toThrow("render failed");

    expect(didCleanup).toBe(true);
  });

  it("GIVEN a Container with x and y WHEN rendered with ref THEN ref has typed properties", () => {
    let container!: Pixi.Container;

    const { dispose } = mountTest(() => (
      <Container ref={container} x={10} y={20} />
    ));

    expect(container.x).toBe(10);
    expect(container.y).toBe(20);

    dispose();
  });

  it("GIVEN mountTest with a callback returning a number WHEN called THEN value contains the result", () => {
    const { value, dispose } = mountTest(() => 42);

    expect(value).toBe(42);

    dispose();
  });

  it("GIVEN createManualTicker WHEN fastForwardFrames is called THEN ticker callbacks fire the expected number of times", () => {
    const manual = createManualTicker();
    let calls = 0;

    manual.ticker.add(() => { calls++; });
    manual.fastForwardFrames(5);

    expect(calls).toBe(5);
  });

  it("GIVEN a Container with labelled children WHEN getByLabel is called THEN it finds the correct child", () => {
    let container!: Pixi.Container;

    const { dispose } = mountTest(() => (
      <Container ref={container} label="root">
        <Container label="child-a" />
        <Container label="child-b" />
      </Container>
    ));

    expect(getByLabel(container, "child-a")).toBeDefined();
    expect(getByLabel(container, "child-b")).toBeDefined();
    expect(queryByLabel(container, "missing")).toBeUndefined();
    expect(() => getByLabel(container, "missing")).toThrow();

    dispose();
  });
});
