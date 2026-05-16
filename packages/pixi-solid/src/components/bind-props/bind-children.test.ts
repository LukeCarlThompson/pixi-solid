import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { mountHeadless } from "../../testing";

import {
  bindChildrenToContainer,
  bindChildrenToRenderLayer,
  InvalidChildTypeError,
} from "./bind-children";

// oxlint-disable typescript/unbound-method

const createMockContainer = () => ({
  addChild: vi.fn(),
  addChildAt: vi.fn(),
  removeChild: vi.fn(),
  destroy: vi.fn(),
});

const createMockRenderLayer = () => ({
  attach: vi.fn(),
  detach: vi.fn(),
});

describe("bindChildrenToContainer()", () => {
  it("GIVEN initial children WHEN bindChildrenToContainer runs THEN it adds children in order", () => {
    const parent = createMockContainer() as unknown as Pixi.Container;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const [children] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToContainer(parent, (() => children()) as any);
      return null;
    });

    expect(parent.addChildAt).toHaveBeenCalledTimes(3);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(3, childC, 2);
    dispose();
  });

  it("GIVEN three children WHEN adding another child THEN it adds the new child in order", () => {
    const parent = createMockContainer() as unknown as Pixi.Container;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const childD = createMockContainer() as unknown as Pixi.Container;
    const [children, setChildren] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToContainer(parent, (() => children()) as any);
      return null;
    });

    setChildren([childA, childB, childC, childD]);

    expect(parent.addChildAt).toHaveBeenCalledTimes(7);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(3, childC, 2);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(4, childA, 0);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(5, childB, 1);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(6, childC, 2);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(7, childD, 3);
    dispose();
  });

  it("GIVEN three children WHEN they are re-ordered THEN it re-adds children in new order", () => {
    const parent = createMockContainer() as unknown as Pixi.Container;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const [children, setChildren] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToContainer(parent, (() => children()) as any);
      return null;
    });

    setChildren([childC, childB, childA]);

    expect(parent.removeChild).not.toHaveBeenCalled();
    expect(parent.addChildAt).toHaveBeenCalledTimes(6);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(4, childC, 0);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(5, childB, 1);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(6, childA, 2);
    dispose();
  });

  it("GIVEN children with undefined values WHEN bindChildrenToContainer runs THEN it filters out undefined children", () => {
    const parent = createMockContainer() as unknown as Pixi.Container;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const [children] = createSignal([childA, undefined, childB]);

    const dispose = mountHeadless(() => {
      bindChildrenToContainer(parent, (() => children()) as any);
      return null;
    });

    expect(parent.addChildAt).toHaveBeenCalledTimes(2);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
    expect(parent.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
    dispose();
  });

  it("GIVEN invalid children WHEN addChildAt throws THEN it throws InvalidChildTypeError", () => {
    const fn = () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = { invalid: true } as unknown as Pixi.Container;
      const [children] = createSignal([childA]);

      parent.addChildAt = vi.fn().mockImplementation(() => {
        throw new Error("Cannot read properties of undefined (reading 'parent')");
      });

      const dispose = mountHeadless(() => {
        bindChildrenToContainer(parent, (() => children()) as any);
        return null;
      });

      dispose();
    };

    expect(fn).toThrow(InvalidChildTypeError);
  });

  it("GIVEN invalid children WHEN addChildAt throws THEN the error message is helpful", () => {
    let caughtError: unknown;

    const fn = () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = { invalid: true } as unknown as Pixi.Container;
      const [children] = createSignal([childA]);

      parent.addChildAt = vi.fn().mockImplementation(() => {
        throw new Error("Cannot read properties of undefined (reading 'parent')");
      });

      try {
        const dispose = mountHeadless(() => {
          bindChildrenToContainer(parent, (() => children()) as any);
          return null;
        });

        dispose();
      } catch (error) {
        caughtError = error;
        throw error;
      }
    };

    expect(fn).toThrow(InvalidChildTypeError);
    expect(caughtError).toBeInstanceOf(InvalidChildTypeError);
    if (caughtError instanceof InvalidChildTypeError) {
      expect(caughtError.message).toContain("Invalid pixi-solid child type");
      expect(caughtError.cause).toBeDefined();
    }
  });

  it("GIVEN multiple children with one invalid WHEN addChildAt throws THEN InvalidChildTypeError is thrown", () => {
    const fn = () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const validChild = createMockContainer() as unknown as Pixi.Container;
      const invalidChild = { invalid: true } as unknown as Pixi.Container;
      const [children] = createSignal([validChild, invalidChild]);

      let callCount = 0;
      parent.addChildAt = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          throw new Error("Invalid child type");
        }
      });

      const dispose = mountHeadless(() => {
        bindChildrenToContainer(parent, (() => children()) as any);
        return null;
      });

      dispose();
    };

    expect(fn).toThrow(InvalidChildTypeError);
  });
});

describe("bindChildrenToRenderLayer()", () => {
  it("GIVEN initial children WHEN bindChildrenToRenderLayer runs THEN it attaches children in order", () => {
    const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const [children] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToRenderLayer(parent, (() => children()) as any);
      return null;
    });

    expect(parent.attach).toHaveBeenCalledTimes(3);
    expect(parent.attach).toHaveBeenNthCalledWith(1, childA);
    expect(parent.attach).toHaveBeenNthCalledWith(2, childB);
    expect(parent.attach).toHaveBeenNthCalledWith(3, childC);
    dispose();
  });

  it("GIVEN three children WHEN a child is removed THEN it detaches the child", () => {
    const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const [children, setChildren] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToRenderLayer(parent, (() => children()) as any);
      return null;
    });

    setChildren([childA, childB]);

    expect(parent.detach).toHaveBeenCalledTimes(1);
    expect(parent.detach).toHaveBeenCalledWith(childC);
    dispose();
  });

  it("GIVEN three children WHEN children are reordered THEN it re-attaches children in new order", () => {
    const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const childC = createMockContainer() as unknown as Pixi.Container;
    const [children, setChildren] = createSignal([childA, childB, childC]);

    const dispose = mountHeadless(() => {
      bindChildrenToRenderLayer(parent, (() => children()) as any);
      return null;
    });

    setChildren([childC, childB, childA]);

    expect(parent.detach).not.toHaveBeenCalled();
    expect(parent.attach).toHaveBeenCalledTimes(6);
    expect(parent.attach).toHaveBeenNthCalledWith(4, childC);
    expect(parent.attach).toHaveBeenNthCalledWith(5, childB);
    expect(parent.attach).toHaveBeenNthCalledWith(6, childA);
    dispose();
  });

  it("GIVEN children with undefined values WHEN bindChildrenToRenderLayer runs THEN it filters out undefined children", () => {
    const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
    const childA = createMockContainer() as unknown as Pixi.Container;
    const childB = createMockContainer() as unknown as Pixi.Container;
    const [children] = createSignal([childA, undefined, childB]);

    const dispose = mountHeadless(() => {
      bindChildrenToRenderLayer(parent, (() => children()) as any);
      return null;
    });

    expect(parent.attach).toHaveBeenCalledTimes(2);
    expect(parent.attach).toHaveBeenNthCalledWith(1, childA);
    expect(parent.attach).toHaveBeenNthCalledWith(2, childB);
    dispose();
  });

  it("GIVEN invalid children WHEN attach throws THEN it throws InvalidChildTypeError", () => {
    const fn = () => {
      const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
      const childA = { invalid: true } as unknown as Pixi.Container;
      const [children] = createSignal([childA]);

      parent.attach = vi.fn().mockImplementation(() => {
        throw new Error("Invalid child");
      });

      const dispose = mountHeadless(() => {
        bindChildrenToRenderLayer(parent, (() => children()) as any);
        return null;
      });

      dispose();
    };

    expect(fn).toThrow(InvalidChildTypeError);
  });
});
