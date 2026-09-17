import type * as Pixi from "pixi.js";
import { Container as PixiContainer, Filter } from "pixi.js";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mountScene } from "../testing";

import { Container } from "./components";
import type { PixiComponentProps } from "./factories";
import { createContainerComponent, createFilterComponent } from "./factories";

class MutatingContainer extends PixiContainer {
  marker: string;

  constructor(options: { marker?: string }) {
    options.marker ??= "default";
    super();
    this.marker = options.marker;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Component factory constructor options", () => {
  it("GIVEN spread props without a marker WHEN the constructor adds its default THEN the constructor receives a mutable options object", () => {
    const TestComponent = createContainerComponent<MutatingContainer, { marker?: string }>(
      MutatingContainer,
    );
    const [props] = createSignal<{ marker?: string }>({});
    let instance: MutatingContainer | undefined;

    const { dispose } = mountScene(() => (
      <TestComponent
        {...props()}
        ref={(value) => {
          instance = value;
        }}
      />
    ));

    expect(instance?.marker).toBe("default");

    dispose();
  });
});

describe("createFilterComponent cleanup", () => {
  it("GIVEN a filter component WHEN root is disposed THEN instance is destroyed", () => {
    const TestFilter = createFilterComponent<Filter, object>(Filter);

    let filterRef: Filter | undefined;
    let destroyCalled = false;

    const { dispose } = mountScene(() => (
      <TestFilter
        ref={(el) => {
          filterRef = el;
          const originalDestroy = el.destroy.bind(el);
          el.destroy = vi.fn(() => {
            destroyCalled = true;
            originalDestroy();
          });
        }}
      />
    ));

    expect(filterRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });
});

describe("Component factory spread props", () => {
  it("GIVEN a Container with spread signal props WHEN a property is added to the signal object after initialization THEN the new property is applied to the instance", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      y: 20,
      skewY: 0.5,
    });

    let containerRef: Pixi.Container | undefined;

    const { dispose } = mountScene(() => (
      <Container
        ref={(el) => {
          containerRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    expect(containerRef.x).toBe(10);
    expect(containerRef.y).toBe(20);
    expect(containerRef.skew.y).toBe(0.5);

    setPropsSignal(() => ({
      x: 1,
      y: 1,
      alpha: 0.5,
      skewY: 2,
      scaleX: 2,
    }));

    expect(containerRef.scale.x).toBe(2);
    expect(containerRef.skew.y).toBe(2);
    expect(containerRef.alpha).toBe(0.5);
    expect(containerRef.x).toBe(1);
    expect(containerRef.y).toBe(1);

    dispose();
  });

  it("GIVEN a Container with spread signal props WHEN a property is removed from the signal THEN the property retains its previous value", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      alpha: 0.8,
      visible: true,
    });

    let containerRef: Pixi.Container | undefined;

    const { dispose } = mountScene(() => (
      <Container
        ref={(el) => {
          containerRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    expect(containerRef.x).toBe(10);
    expect(containerRef.alpha).toBe(0.8);
    expect(containerRef.visible).toBe(true);

    setPropsSignal(() => ({ x: 20 }));

    expect(containerRef.x).toBe(20);
    expect(containerRef.alpha).toBe(0.8);
    expect(containerRef.visible).toBe(true);

    dispose();
  });

  it("GIVEN a Container with spread signal props WHEN only some props in the signal change THEN only those props are updated", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 0,
      y: 0,
      alpha: 1,
      rotation: 0,
    });

    let containerRef: Pixi.Container | undefined;

    const { dispose } = mountScene(() => (
      <Container
        ref={(el) => {
          containerRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    const initialRotation = containerRef.rotation;

    setPropsSignal((previous) => ({
      ...previous,
      x: 100,
      alpha: 0.5,
    }));

    expect(containerRef.x).toBe(100);
    expect(containerRef.alpha).toBe(0.5);
    expect(containerRef.y).toBe(0);
    expect(containerRef.rotation).toBe(initialRotation);

    dispose();
  });

  it("GIVEN a Container with point props WHEN updating x separately from y THEN each updates independently", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      y: 20,
    });

    let containerRef: Pixi.Container | undefined;

    const { dispose } = mountScene(() => (
      <Container
        ref={(el) => {
          containerRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    expect(containerRef.x).toBe(10);
    expect(containerRef.y).toBe(20);

    setPropsSignal(() => ({ x: 50, y: 20 }));

    expect(containerRef.x).toBe(50);
    expect(containerRef.y).toBe(20);

    setPropsSignal(() => ({ x: 50, y: 100 }));

    expect(containerRef.x).toBe(50);
    expect(containerRef.y).toBe(100);

    dispose();
  });

  it("GIVEN a Container with spread signal props including event handlers WHEN the handler in the signal changes THEN the old handler is removed and new handler is bound", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      onclick: handler1,
    });

    let containerRef: Pixi.Container | undefined;

    const { dispose } = mountScene(() => (
      <Container
        ref={(el) => {
          containerRef = el;
        }}
        {...propsSignal()}
      />
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    containerRef.emit("click", {} as Pixi.FederatedPointerEvent);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    setPropsSignal(() => ({ onclick: handler2 }));

    containerRef.emit("click", {} as Pixi.FederatedPointerEvent);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    dispose();
  });
});
