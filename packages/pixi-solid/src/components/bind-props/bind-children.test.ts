import { describe, expect, it, vi } from "vitest";
import { createRoot, createSignal } from "solid-js";
import { bindChildrenToContainer, bindChildrenToRenderLayer } from "./bind-children";
import type * as Pixi from "pixi.js";

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
  it("GIVEN initial children WHEN bindChildrenToContainer runs THEN it adds children in order", async () => {
    await createRoot(async () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children] = createSignal([childA, childB, childC]);

      bindChildrenToContainer(parent, (() => children()) as any);

      await Promise.resolve();
      expect(parent.addChildAt).toHaveBeenCalledTimes(3);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(3, childC, 2);
    });
  });

  it("GIVEN three children WHEN adding another child THEN it adds the new child in order", async () => {
    await createRoot(async () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const childD = createMockContainer() as unknown as Pixi.Container;
      const [children, setChildren] = createSignal([childA, childB, childC]);

      bindChildrenToContainer(parent, (() => children()) as any);
      await Promise.resolve();

      setChildren([childA, childB, childC, childD]);

      expect(parent.addChildAt).toHaveBeenCalledTimes(7);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(3, childC, 2);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(4, childA, 0);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(5, childB, 1);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(6, childC, 2);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(7, childD, 3);
    });
  });

  it("GIVEN three children WHEN one is removed THEN it removes and destroys the child", async () => {
    await createRoot(async () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children, setChildren] = createSignal([childA, childB, childC]);

      bindChildrenToContainer(parent, (() => children()) as any);
      await Promise.resolve();

      setChildren([childA, childB]);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(childC);
      expect(childC.destroy).toHaveBeenCalledWith({ children: true });
    });
  });

  it("GIVEN three children WHEN they are re-oredered THEN it re-adds children in new order", async () => {
    await createRoot(async () => {
      const parent = createMockContainer() as unknown as Pixi.Container;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children, setChildren] = createSignal([childA, childB, childC]);

      bindChildrenToContainer(parent, (() => children()) as any);
      await Promise.resolve();

      setChildren([childC, childB, childA]);

      expect(parent.removeChild).not.toHaveBeenCalled();
      expect(parent.addChildAt).toHaveBeenCalledTimes(6);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(4, childC, 0);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(5, childB, 1);
      expect(parent.addChildAt).toHaveBeenNthCalledWith(6, childA, 2);
    });
  });
});

describe("bindChildrenToRenderLayer()", () => {
  it("GIVEN initial children WHEN bindChildrenToRenderLayer runs THEN it attaches children in order", async () => {
    await createRoot(async () => {
      const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children] = createSignal([childA, childB, childC]);

      bindChildrenToRenderLayer(parent, (() => children()) as any);
      await Promise.resolve();

      expect(parent.attach).toHaveBeenCalledTimes(3);
      expect(parent.attach).toHaveBeenNthCalledWith(1, childA);
      expect(parent.attach).toHaveBeenNthCalledWith(2, childB);
      expect(parent.attach).toHaveBeenNthCalledWith(3, childC);
    });
  });

  it("GIVEN three children WHEN a child is removed THEN it detaches the child", async () => {
    await createRoot(async () => {
      const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children, setChildren] = createSignal([childA, childB, childC]);

      bindChildrenToRenderLayer(parent, (() => children()) as any);

      await Promise.resolve();
      setChildren([childA, childB]);

      expect(parent.detach).toHaveBeenCalledTimes(1);
      expect(parent.detach).toHaveBeenCalledWith(childC);
    });
  });

  it("GIVEN three children WHEN children are reordered THEN it re-attaches children in new order", async () => {
    await createRoot(async () => {
      const parent = createMockRenderLayer() as unknown as Pixi.RenderLayer;
      const childA = createMockContainer() as unknown as Pixi.Container;
      const childB = createMockContainer() as unknown as Pixi.Container;
      const childC = createMockContainer() as unknown as Pixi.Container;
      const [children, setChildren] = createSignal([childA, childB, childC]);

      bindChildrenToRenderLayer(parent, (() => children()) as any);

      await Promise.resolve();
      setChildren([childC, childB, childA]);

      expect(parent.detach).not.toHaveBeenCalled();
      expect(parent.attach).toHaveBeenCalledTimes(6);
      expect(parent.attach).toHaveBeenNthCalledWith(4, childC);
      expect(parent.attach).toHaveBeenNthCalledWith(5, childB);
      expect(parent.attach).toHaveBeenNthCalledWith(6, childA);
    });
  });
});
