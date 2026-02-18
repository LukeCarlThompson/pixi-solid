import { render } from "@solidjs/testing-library";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { NoMount } from "../testing";

import type { PixiComponentProps } from "./component-factories";
import { Container } from "./components";

describe("Container with spread signal props", () => {
  it("GIVEN a Container with spread signal props WHEN a property is added to the signal object after initialization THEN the new property is applied to the instance", () => {
    // GIVEN: Create a signal with an object containing initial properties
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      y: 20,
      skewY: 0.5,
    });

    let containerRef: Pixi.Container | undefined;

    // WHEN: Render a Container with spread props from the signal
    render(() => (
      <NoMount>
        <Container
          ref={(el) => {
            containerRef = el;
          }}
          {...propsSignal()}
        />
      </NoMount>
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    // THEN: The initial properties should be set
    expect(containerRef).toBeDefined();
    expect(containerRef.x).toBe(10);
    expect(containerRef.y).toBe(20);
    expect(containerRef.skew.y).toBe(0.5);

    // WHEN: Add a new property to the signal object
    setPropsSignal(() => ({
      x: 1,
      y: 1,
      alpha: 0.5,
      skewY: 2,
      scaleX: 2,
    }));

    // THEN: The new property should be applied
    expect(containerRef.scale.x).toBe(2);
    expect(containerRef.skew.y).toBe(2);
    expect(containerRef.alpha).toBe(0.5);
    expect(containerRef.x).toBe(1);
    expect(containerRef.y).toBe(1);
  });

  it("GIVEN a Container with spread signal props WHEN a property is removed from the signal THEN the property retains its previous value", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      alpha: 0.8,
      visible: true,
    });

    let containerRef: Pixi.Container | undefined;

    render(() => (
      <NoMount>
        <Container
          ref={(el) => {
            containerRef = el;
          }}
          {...propsSignal()}
        />
      </NoMount>
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    expect(containerRef.x).toBe(10);
    expect(containerRef.alpha).toBe(0.8);
    expect(containerRef.visible).toBe(true);

    // WHEN: Remove alpha and visible from the signal object
    setPropsSignal(() => ({
      x: 20,
    }));

    // THEN: x updates, but alpha and visible retain their previous values
    expect(containerRef.x).toBe(20);
    expect(containerRef.alpha).toBe(0.8);
    expect(containerRef.visible).toBe(true);
  });

  it("GIVEN a Container with spread signal props WHEN only some props in the signal change THEN only those props are updated", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 0,
      y: 0,
      alpha: 1,
      rotation: 0,
    });

    let containerRef: Pixi.Container | undefined;

    render(() => (
      <NoMount>
        <Container
          ref={(el) => {
            containerRef = el;
          }}
          {...propsSignal()}
        />
      </NoMount>
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    const initialRotation = containerRef.rotation;

    // WHEN: Update only x and alpha
    setPropsSignal((prev) => ({
      ...prev,
      x: 100,
      alpha: 0.5,
    }));

    // THEN: x and alpha update, but rotation stays the same
    expect(containerRef.x).toBe(100);
    expect(containerRef.alpha).toBe(0.5);
    expect(containerRef.y).toBe(0);
    expect(containerRef.rotation).toBe(initialRotation);
  });

  it("GIVEN a Container with point props WHEN updating x separately from y THEN each updates independently", () => {
    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      x: 10,
      y: 20,
    });

    let containerRef: Pixi.Container | undefined;

    render(() => (
      <NoMount>
        <Container
          ref={(el) => {
            containerRef = el;
          }}
          {...propsSignal()}
        />
      </NoMount>
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    expect(containerRef.x).toBe(10);
    expect(containerRef.y).toBe(20);

    // WHEN: Update only x
    setPropsSignal(() => ({
      x: 50,
      y: 20,
    }));

    // THEN: Only x changes
    expect(containerRef.x).toBe(50);
    expect(containerRef.y).toBe(20);

    // WHEN: Update only y
    setPropsSignal(() => ({
      x: 50,
      y: 100,
    }));

    // THEN: Only y changes
    expect(containerRef.x).toBe(50);
    expect(containerRef.y).toBe(100);
  });

  it("GIVEN a Container with spread signal props including event handlers WHEN the handler in the signal changes THEN the old handler is removed and new handler is bound", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const [propsSignal, setPropsSignal] = createSignal<PixiComponentProps>({
      onclick: handler1,
    });

    let containerRef: Pixi.Container | undefined;

    render(() => (
      <NoMount>
        <Container
          ref={(el) => {
            containerRef = el;
          }}
          {...propsSignal()}
        />
      </NoMount>
    ));

    if (!containerRef) {
      throw new Error("Container ref was not set");
    }

    // Verify initial handler is set - trigger click to verify handler1 was called
    containerRef.emit("click", {} as Pixi.FederatedPointerEvent);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    // WHEN: Change the handler in the signal
    setPropsSignal(() => ({
      onclick: handler2,
    }));

    // THEN: The new handler is called, not the old one
    containerRef.emit("click", {} as Pixi.FederatedPointerEvent);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
