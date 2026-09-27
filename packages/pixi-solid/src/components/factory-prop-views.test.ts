import type * as Pixi from "pixi.js";
import { createRoot, createSignal, flush, merge } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { Container } from "./components";
import type { PixiComponentProps } from "./factories";

const mountContainer = (props: Parameters<typeof Container>[0]) => {
  let container: Pixi.Container | undefined;
  let disposeRoot: (() => void) | undefined;
  const propsWithRef = merge(props, {
    ref: (instance: Pixi.Container) => {
      container = instance;
    },
  });

  createRoot((dispose) => {
    disposeRoot = dispose;
    Container(propsWithRef);
    flush();
  });

  if (!container) throw new Error("Container ref was not set");

  return { container, dispose: () => disposeRoot?.() };
};

describe("Solid 2 component prop binding", () => {
  it("GIVEN props from a merge view WHEN the source changes THEN runtime Pixi props update", () => {
    // GIVEN
    const [source, setSource] = createSignal<PixiComponentProps>({ x: 10, scaleX: 1 });
    const props = merge(() => source());
    const { container, dispose } = mountContainer(props);

    // WHEN
    setSource(() => ({ x: 25, scaleX: 3 }));
    flush();

    // THEN
    expect(container.x).toBe(25);
    expect(container.scale.x).toBe(3);
    dispose();
  });

  it("GIVEN a merge view with changing keys WHEN the source changes THEN new runtime and constructor props bind", () => {
    // GIVEN
    const [source, setSource] = createSignal<PixiComponentProps>({ x: 10, skewY: 0.5 });
    const props = merge(() => source());
    const { container, dispose } = mountContainer(props);

    // WHEN
    setSource(() => ({ x: 1, y: 1, alpha: 0.5, skewY: 2, scaleX: 2 }));
    flush();

    // THEN
    expect(container.x).toBe(1);
    expect(container.y).toBe(1);
    expect(container.alpha).toBe(0.5);
    expect(container.skew.y).toBe(2);
    expect(container.scale.x).toBe(2);
    dispose();
  });

  it("GIVEN constructor props from a merge view WHEN the source changes THEN the initialized instance updates", () => {
    // GIVEN
    const [source, setSource] = createSignal<PixiComponentProps>({ alpha: 0.4 });
    const props = merge(() => source());
    const { container, dispose } = mountContainer(props);

    expect(container.alpha).toBe(0.4);

    // WHEN
    setSource(() => ({ alpha: 0.8 }));
    flush();

    // THEN
    expect(container.alpha).toBe(0.8);
    dispose();
  });

  it("GIVEN an event handler from a merge view WHEN it changes and the owner disposes THEN listeners are replaced and cleaned up", () => {
    // GIVEN
    const firstHandler = vi.fn();
    const nextHandler = vi.fn();
    const [source, setSource] = createSignal<PixiComponentProps>({ onclick: firstHandler });
    const props = merge(() => source());
    const { container, dispose } = mountContainer(props);

    // WHEN
    setSource(() => ({ onclick: nextHandler }));
    flush();
    container.emit("click", {} as Pixi.FederatedPointerEvent);

    // THEN
    expect(firstHandler).not.toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalledTimes(1);

    dispose();
    expect(container.destroyed).toBe(true);
    container.emit("click", {} as Pixi.FederatedPointerEvent);
    expect(nextHandler).toHaveBeenCalledTimes(1);
  });
});
