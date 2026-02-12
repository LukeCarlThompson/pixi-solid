import { describe, expect, it, vi } from "vitest";
import { createRoot, createSignal } from "solid-js";
import { bindProps } from ".";

class MockContainer {
  x = 0;
  y = 0;
  addChild = vi.fn();
  addChildAt = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

describe("bindProps()", () => {
  it("GIVEN an instance and props with position and children WHEN bindProps is called THEN instance is updated and children are added", () => {
    createRoot(() => {
      const instance = new MockContainer();
      const childA = new MockContainer();
      const childB = new MockContainer();

      bindProps(instance as any, {
        x: 10,
        y: 20,
        children: [childA, childB] as any,
      });

      expect(instance.x).toBe(10);
      expect(instance.y).toBe(20);
      expect(instance.addChildAt).toHaveBeenCalledTimes(2);
      expect(instance.addChildAt).toHaveBeenNthCalledWith(1, childA, 0);
      expect(instance.addChildAt).toHaveBeenNthCalledWith(2, childB, 1);
    });
  });

  it("GIVEN an instance and a ref callback WHEN bindProps is called THEN the ref is called with the instance", () => {
    createRoot(() => {
      const instance = new MockContainer();
      const ref = vi.fn();

      bindProps(instance as any, { ref } as any);

      expect(ref).toHaveBeenCalledWith(instance);
    });
  });

  it("GIVEN deferred reactive props WHEN bindProps is called THEN the instance is not updated on the first run", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      const [x] = createSignal(1);

      const props = {
        get x() {
          return x();
        },
      };

      bindProps(instance as any, props as any, true);

      // Wait for call stack to flush so the createRenderEffect has a chance to run
      await Promise.resolve();

      expect(instance.x).toBe(0);
    });
  });

  it("GIVEN deferred reactive props WHEN the prop value changes THEN the instance is updated", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      const [x, setX] = createSignal(1);

      const props = {
        get x() {
          return x();
        },
      };

      bindProps(instance as any, props as any, true);

      await Promise.resolve();
      expect(instance.x).toBe(0);

      setX(5);
      expect(instance.x).toBe(5);
    });
  });

  it("GIVEN an instance and an onclick handler prop WHEN bindProps is called THEN it adds the event listener", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      const handler = vi.fn();

      bindProps(instance as any, { onclick: handler } as any);

      await Promise.resolve();
      expect(instance.addEventListener).toHaveBeenCalledTimes(1);
      expect(instance.addEventListener).toHaveBeenCalledWith("click", handler);
    });
  });

  it("GIVEN an instance with an onclick handler prop WHEN the handler changes THEN the previous listener is removed and the new one is added", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      const handlerA = vi.fn();
      const handlerB = vi.fn();
      const [handler, setHandler] = createSignal(handlerA);

      const props = {
        get onclick() {
          return handler();
        },
      };

      bindProps(instance as any, props as any);

      await Promise.resolve();
      setHandler(() => handlerB);

      expect(instance.removeEventListener).toHaveBeenCalledTimes(1);
      expect(instance.removeEventListener).toHaveBeenCalledWith("click", handlerA);
      expect(instance.addEventListener).toHaveBeenCalledTimes(2);
      expect(instance.addEventListener).toHaveBeenLastCalledWith("click", handlerB);
    });
  });
});
