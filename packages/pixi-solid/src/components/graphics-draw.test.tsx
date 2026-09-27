import { Graphics as PixiGraphics } from "pixi.js";
import { createSignal, flush, resetErrorHalt } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mountScene } from "../testing";

import { Graphics } from "./components";

afterEach(() => {
  resetErrorHalt();
});

const widthOf = (graphics: PixiGraphics) => graphics.getLocalBounds().width;

describe("Graphics draw prop", () => {
  it("GIVEN a draw prop WHEN the component mounts THEN the callback runs once with the instance", () => {
    const drawn: PixiGraphics[] = [];

    const { queryByLabel, dispose } = mountScene(() => (
      <Graphics
        label="graphics"
        draw={(graphics) => {
          drawn.push(graphics);
          graphics.rect(0, 0, 10, 10).fill("#ff0000");
        }}
      />
    ));

    flush();

    const graphics = queryByLabel("graphics") as PixiGraphics;
    expect(drawn).toEqual([graphics]);
    expect(widthOf(graphics)).toBe(10);
    dispose();
  });

  it("GIVEN a draw reading a signal WHEN the signal changes THEN the drawing is replaced, not accumulated", () => {
    const [size, setSize] = createSignal(10);
    const draws: number[] = [];

    const { queryByLabel, dispose } = mountScene(() => (
      <Graphics
        label="graphics"
        draw={(graphics) => {
          draws.push(size());
          graphics.rect(0, 0, size(), size()).fill("#ff0000");
        }}
      />
    ));

    flush();
    const graphics = queryByLabel("graphics") as PixiGraphics;
    expect(widthOf(graphics)).toBe(10);

    setSize(30);
    flush();

    expect(draws).toEqual([10, 30]);
    // One rectangle, not two: the instance is cleared before each run.
    expect(widthOf(graphics)).toBe(30);
    expect(graphics.context.instructions.length).toBe(1);
    dispose();
  });

  it("GIVEN a draw reading two signals WHEN both change together THEN it runs once with settled values", () => {
    const [a, setA] = createSignal(1);
    const [b, setB] = createSignal(1);
    const draws: string[] = [];

    const { dispose } = mountScene(() => (
      <Graphics
        draw={() => {
          draws.push(`${a()}-${b()}`);
        }}
      />
    ));

    flush();
    expect(draws).toEqual(["1-1"]);

    setA(2);
    setB(3);
    flush();

    // Coalesced into one run, and it observes the committed values.
    expect(draws).toEqual(["1-1", "2-3"]);
    dispose();
  });

  it("GIVEN a draw that reads nothing WHEN an unrelated signal changes THEN it does not re-run", () => {
    const [unrelated, setUnrelated] = createSignal(0);
    const draw = vi.fn();

    const { dispose } = mountScene(() => <Graphics label="graphics" draw={draw} />);

    flush();
    expect(draw).toHaveBeenCalledTimes(1);

    setUnrelated(1);
    flush();

    expect(unrelated()).toBe(1);
    expect(draw).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("GIVEN a draw prop WHEN the scene unmounts THEN a later signal change does not re-run it", () => {
    const [size, setSize] = createSignal(10);
    const draw = vi.fn();

    const { dispose } = mountScene(() => (
      <Graphics
        draw={(graphics) => {
          draw(size());
          graphics.rect(0, 0, size(), size()).fill("#ff0000");
        }}
      />
    ));

    flush();
    expect(draw).toHaveBeenCalledTimes(1);

    dispose();
    setSize(50);
    flush();

    expect(draw).toHaveBeenCalledTimes(1);
  });

  it("GIVEN draw alongside other props WHEN those props change THEN they still update and `draw` is not set on the instance", () => {
    const [x, setX] = createSignal(5);

    const { queryByLabel, dispose } = mountScene(() => (
      <Graphics
        label="graphics"
        x={x()}
        draw={(graphics) => {
          graphics.circle(0, 0, 4).fill("#00ff00");
        }}
      />
    ));

    flush();
    const graphics = queryByLabel("graphics") as PixiGraphics;
    expect(graphics.x).toBe(5);
    expect("draw" in graphics).toBe(false);

    setX(20);
    flush();

    expect(graphics.x).toBe(20);
    dispose();
  });

  it("GIVEN no draw prop WHEN the component mounts THEN the instance is created for ref use", () => {
    let captured: PixiGraphics | undefined;

    const { queryByLabel, dispose } = mountScene(() => (
      <Graphics
        label="graphics"
        ref={(graphics: PixiGraphics) => {
          captured = graphics;
          graphics.rect(0, 0, 7, 7).fill("#0000ff");
        }}
      />
    ));

    flush();

    expect(captured).toBe(queryByLabel("graphics"));
    expect(widthOf(captured!)).toBe(7);
    dispose();
  });

  it("GIVEN an existing instance via `as` WHEN draw is provided THEN it draws on it and does not destroy it", () => {
    const existing = new PixiGraphics();
    const destroyed = vi.fn();
    const originalDestroy = existing.destroy.bind(existing);
    existing.destroy = vi.fn((options) => {
      destroyed();
      originalDestroy(options);
    }) as typeof existing.destroy;

    let captured: PixiGraphics | undefined;

    const { dispose } = mountScene(() => (
      <Graphics
        as={existing}
        ref={(graphics: PixiGraphics) => {
          captured = graphics;
        }}
        draw={(graphics) => {
          graphics.rect(0, 0, 12, 12).fill("#ff0000");
        }}
      />
    ));

    flush();
    expect(captured).toBe(existing);
    expect(widthOf(existing)).toBe(12);

    dispose();
    expect(destroyed).not.toHaveBeenCalled();
  });
});
