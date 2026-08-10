import { createRoot, createSignal, createContext, useContext, onMount } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { renderHook } from "../../testing";

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
  on = vi.fn();
  off = vi.fn();
}

const createMockPoint = () => {
  const point = {
    x: 0,
    y: 0,
    set: vi.fn((x: number, y?: number) => {
      if (typeof y === "number") {
        point.x = x;
        point.y = y;
        return;
      }

      point.x = x;
      point.y = x;
    }),
  };

  return point;
};

class MockPointContainer extends MockContainer {
  position = createMockPoint();
  scale = createMockPoint();
  pivot = createMockPoint();
  skew = createMockPoint();
  anchor = createMockPoint();
  tilePosition = createMockPoint();
  tileScale = createMockPoint();
}

class MockRenderLayer extends MockContainer {
  attach = vi.fn();
  detach = vi.fn();
}

describe("bindRuntimeProps()", () => {
  it("GIVEN an instance and props with position and children WHEN bindRuntimeProps is called THEN instance is updated and children are added", () => {
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

  it("GIVEN an instance and a ref callback WHEN bindRuntimeProps is called THEN the ref is called with the instance", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const ref = vi.fn();

      bindRuntimeProps(instance as any, { ref } as any);

      return { instance, ref };
    });

    expect(result().ref).toHaveBeenCalledWith(result().instance);
    dispose();
  });

  it("GIVEN a parent with a child that has a ref WHEN bindRuntimeProps is called THEN the ref is called before the child is added to the parent", () => {
    const { result, dispose } = renderHook(() => {
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

      return { child, childRef, childParentAtRefTime };
    });

    // The ref should have been called
    expect(result().childRef).toHaveBeenCalledWith(result().child);
    // And the parent should be set when the ref is called
    expect(result().childParentAtRefTime).toBe(null);
    dispose();
  });

  it("GIVEN a ref callback that uses a context provider WHEN bindRuntimeProps is called THEN the ref can access the context", () => {
    const { result, dispose } = renderHook(() => {
      const TestContext = createContext<string>();
      const instance = new MockContainer();
      let contextValue: string | undefined;

      const ref = vi.fn(() => {
        // Try to access the context in the ref callback
        contextValue = useContext(TestContext);
      });

      // Create a context provider
      const Provider = TestContext.Provider;

      // Bind props within the context
      Provider({
        value: "test-value",
        get children() {
          bindRuntimeProps(instance as any, { ref } as any);
          return null;
        },
      });

      return { instance, ref, contextValue };
    });

    // The ref should have been called
    expect(result().ref).toHaveBeenCalledWith(result().instance);
    // And it should have access to the context
    expect(result().contextValue).toBe("test-value");
    dispose();
  });

  it("GIVEN a ref callback WHEN onMount runs THEN the ref value is available", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      let refValue: MockContainer | undefined;
      const state: { refValueAtMount?: MockContainer } = {};

      const ref = vi.fn((value: MockContainer) => {
        refValue = value;
      });

      onMount(() => {
        state.refValueAtMount = refValue;
      });

      bindRuntimeProps(instance as any, { ref } as any);

      return { instance, ref, state };
    });

    expect(result().ref).toHaveBeenCalledWith(result().instance);
    expect(result().state.refValueAtMount).toBe(result().instance);
    dispose();
  });

  it("GIVEN an instance and an onclick handler prop WHEN bindRuntimeProps is called THEN it adds the event listener", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const handler = vi.fn();

      bindRuntimeProps(instance as any, { onclick: handler } as any);

      return { instance, handler };
    });

    expect(result().instance.on).toHaveBeenCalledTimes(1);
    expect(result().instance.on).toHaveBeenCalledWith("click", result().handler);
    dispose();
  });

  it("GIVEN an instance with an onclick handler prop WHEN the handler changes THEN the previous listener is removed and the new one is added", () => {
    const { result, dispose } = renderHook(() => {
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

      return { instance, handlerA, handlerB, setHandler };
    });

    result().setHandler(() => result().handlerB);

    expect(result().instance.off).toHaveBeenCalledTimes(1);
    expect(result().instance.off).toHaveBeenCalledWith("click", result().handlerA);
    expect(result().instance.on).toHaveBeenCalledTimes(2);
    expect(result().instance.on).toHaveBeenLastCalledWith("click", result().handlerB);
    dispose();
  });

  it("GIVEN an onclick handler prop that is unset WHEN bindRuntimeProps reruns THEN it removes the previous listener", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const handlerA = vi.fn();
      const [handler, setHandler] = createSignal<(() => void) | undefined>(handlerA);

      const props = {
        get onclick() {
          return handler();
        },
      };

      bindRuntimeProps(instance as any, props as any);

      return { instance, handlerA, setHandler };
    });

    result().setHandler(undefined);

    expect(result().instance.off).toHaveBeenCalledTimes(1);
    expect(result().instance.off).toHaveBeenCalledWith("click", result().handlerA);
    expect(result().instance.on).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("GIVEN a point prop object WHEN bindRuntimeProps is called THEN it sets the point values", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockPointContainer();

      bindRuntimeProps(instance as any, { position: { x: 3, y: 7 } } as any);

      return { instance };
    });

    expect(result().instance.position.set).toHaveBeenCalledWith(3, 7);
    dispose();
  });

  it("GIVEN a point axis prop WHEN it changes THEN the axis value updates", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockPointContainer();
      const [positionX, setPositionX] = createSignal(4);

      const props = {
        get positionX() {
          return positionX();
        },
      };

      bindRuntimeProps(instance as any, props as any);

      return { instance, setPositionX };
    });

    expect(result().instance.position.x).toBe(4);

    result().setPositionX(9);
    expect(result().instance.position.x).toBe(9);
    dispose();
  });

  it("GIVEN render layer children WHEN bindRuntimeProps is called THEN it attaches the children", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockRenderLayer();
      const childA = new MockContainer();
      const childB = new MockContainer();

      bindRuntimeProps(instance as any, { children: [childA, childB] } as any);

      return { instance, childA, childB };
    });

    expect(result().instance.attach).toHaveBeenCalledTimes(2);
    expect(result().instance.attach).toHaveBeenNthCalledWith(1, result().childA);
    expect(result().instance.attach).toHaveBeenNthCalledWith(2, result().childB);
    dispose();
  });

  it("GIVEN an invalid prop WHEN bindRuntimeProps is called THEN it does not throw and does not set the property", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();

      bindRuntimeProps(instance as any, { notAProp: 1 } as any);

      return { instance };
    });

    expect((result().instance as any).notAProp).toBeUndefined();
    dispose();
  });
});

describe("bindInitialisationProps()", () => {
  it("GIVEN deferred reactive props WHEN bindInitialisationProps is called THEN the instance is not updated on the first run", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const [x] = createSignal(1);

      const props = {
        get x() {
          return x();
        },
      };

      bindInitialisationProps(instance as any, props as any);

      return { instance };
    });

    expect(result().instance.x).toBe(0);
    dispose();
  });

  it("GIVEN deferred reactive props WHEN the prop value changes THEN the instance is updated", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const [x, setX] = createSignal(1);

      const props = {
        get x() {
          return x();
        },
      };

      bindInitialisationProps(instance as any, props as any);

      return { instance, setX };
    });

    expect(result().instance.x).toBe(0);

    result().setX(5);
    expect(result().instance.x).toBe(5);
    dispose();
  });

  it("GIVEN a point prop WHEN bindInitialisationProps is called THEN it defers the initial update", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockPointContainer();
      const [position, setPosition] = createSignal({ x: 2, y: 6 });

      const props = {
        get position() {
          return position();
        },
      };

      bindInitialisationProps(instance as any, props as any);

      return { instance, setPosition };
    });

    expect(result().instance.position.set).not.toHaveBeenCalled();

    result().setPosition({ x: 8, y: 9 });
    expect(result().instance.position.set).toHaveBeenCalledWith(8, 9);
    dispose();
  });

  it("GIVEN an invalid prop WHEN bindInitialisationProps is called THEN it does not throw and does not set the property after changes", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const [prop, setProp] = createSignal(1);

      const props = {
        get notAProp() {
          return prop();
        },
      };

      bindInitialisationProps(instance as any, props as any);

      return { instance, setProp };
    });

    expect((result().instance as any).notAProp).toBeUndefined();

    result().setProp(2);
    expect((result().instance as any).notAProp).toBeUndefined();
    dispose();
  });
});
