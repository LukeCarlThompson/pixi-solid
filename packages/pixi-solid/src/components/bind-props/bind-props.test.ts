import { createRoot, createSignal, createContext, useContext, onMount } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { bindInitialisationProps, bindRuntimeProps } from ".";

// TODO: Add in better tests to differentiate between the initialisation and runtime props
class MockContainer {
  x = 0;
  y = 0;
  parent: MockContainer | null = null;
  addChild = vi.fn();
  addChildAt = vi.fn((child: MockContainer) => {
    child.parent = this;
  });
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

describe("bindProps()", () => {
  it("GIVEN an instance and props with position and children WHEN bindProps is called THEN instance is updated and children are added", () => {
    createRoot(() => {
      const instance = new MockContainer();
      const childA = new MockContainer();
      const childB = new MockContainer();

      bindRuntimeProps(instance as any, {
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

  it("GIVEN an instance and a ref callback WHEN bindProps is called THEN the ref is called with the instance", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      const ref = vi.fn();

      bindRuntimeProps(instance as any, { ref } as any);

      // Wait for createRenderEffect to run
      await Promise.resolve();

      expect(ref).toHaveBeenCalledWith(instance);
    });
  });

  it("GIVEN a parent with a child that has a ref WHEN bindProps is called THEN the ref is called before the child is added to the parent", async () => {
    await createRoot(async () => {
      const parent = new MockContainer();
      const child = new MockContainer();
      let childParentAtRefTime: any = undefined;

      const childRef = vi.fn((instance: any) => {
        // Capture what the parent property is when the ref is called
        childParentAtRefTime = instance.parent;
      });

      // First bind the child with a ref
      bindRuntimeProps(child as any, { ref: childRef } as any);

      // Then bind the parent with the child
      bindRuntimeProps(parent as any, { children: [child] } as any);

      // Wait for all effects to run
      await Promise.resolve();

      // The ref should have been called
      expect(childRef).toHaveBeenCalledWith(child);
      // And the parent should be set when the ref is called
      expect(childParentAtRefTime).toBe(null);
    });
  });

  it("GIVEN a ref callback that uses a context provider WHEN bindProps is called THEN the ref can access the context", async () => {
    await createRoot(async () => {
      const TestContext = createContext<string>();
      const instance = new MockContainer();
      let contextValue: string | undefined;

      const ref = vi.fn(() => {
        // Try to access the context in the ref callback
        contextValue = useContext(TestContext);
      });

      // Create a context provider
      const Provider = TestContext.Provider;

      await createRoot(async (_dispose) => {
        await Promise.resolve();
        // Bind props within the context
        return Provider({
          value: "test-value",
          get children() {
            bindRuntimeProps(instance as any, { ref } as any);
            return null;
          },
        });
      });

      // Wait for queueMicrotask to run
      await Promise.resolve();

      // The ref should have been called
      expect(ref).toHaveBeenCalledWith(instance);
      // And it should have access to the context
      expect(contextValue).toBe("test-value");
    });
  });

  it("GIVEN a ref callback WHEN onMount runs THEN the ref value is available", async () => {
    await createRoot(async () => {
      const instance = new MockContainer();
      let refValue: MockContainer | undefined;
      let refValueAtMount: MockContainer | undefined;

      const ref = vi.fn((value: MockContainer) => {
        refValue = value;
      });

      onMount(() => {
        refValueAtMount = refValue;
      });

      bindProps(instance as any, { ref } as any);

      await Promise.resolve();

      expect(ref).toHaveBeenCalledWith(instance);
      expect(refValueAtMount).toBe(instance);
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

      bindInitialisationProps(instance as any, props as any);

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

      bindInitialisationProps(instance as any, props as any);

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

      bindRuntimeProps(instance as any, { onclick: handler } as any);
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

      bindRuntimeProps(instance as any, props as any);
      await Promise.resolve();

      setHandler(() => handlerB);

      expect(instance.removeEventListener).toHaveBeenCalledTimes(1);
      expect(instance.removeEventListener).toHaveBeenCalledWith("click", handlerA);
      expect(instance.addEventListener).toHaveBeenCalledTimes(2);
      expect(instance.addEventListener).toHaveBeenLastCalledWith("click", handlerB);
    });
  });
});
