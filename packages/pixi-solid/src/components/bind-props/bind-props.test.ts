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

const withTestRoot = <T>(setup: () => T): { value: T; dispose: () => void } => {
  let value!: T;
  const dispose = createRoot((disposeRoot) => {
    value = setup();
    return disposeRoot;
  });

  return { value, dispose };
};

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
    const { value, dispose } = withTestRoot(() => {
      const instance = new MockContainer();
      const ref = vi.fn();

      bindRuntimeProps(instance as any, { ref } as any);

      return { instance, ref };
    });

    expect(value.ref).toHaveBeenCalledWith(value.instance);
    dispose();
  });

  it("GIVEN a parent with a child that has a ref WHEN bindRuntimeProps is called THEN the ref is called before the child is added to the parent", () => {
    const { value, dispose } = withTestRoot(() => {
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
    expect(value.childRef).toHaveBeenCalledWith(value.child);
    // And the parent should be set when the ref is called
    expect(value.childParentAtRefTime).toBe(null);
    dispose();
  });

  it("GIVEN a ref callback that uses a context provider WHEN bindRuntimeProps is called THEN the ref can access the context", () => {
    const { value, dispose } = withTestRoot(() => {
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
    expect(value.ref).toHaveBeenCalledWith(value.instance);
    // And it should have access to the context
    expect(value.contextValue).toBe("test-value");
    dispose();
  });

  it("GIVEN a ref callback WHEN onMount runs THEN the ref value is available", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect(value.ref).toHaveBeenCalledWith(value.instance);
    expect(value.state.refValueAtMount).toBe(value.instance);
    dispose();
  });

  it("GIVEN an instance and an onclick handler prop WHEN bindRuntimeProps is called THEN it adds the event listener", () => {
    const { value, dispose } = withTestRoot(() => {
      const instance = new MockContainer();
      const handler = vi.fn();

      bindRuntimeProps(instance as any, { onclick: handler } as any);

      return { instance, handler };
    });

    expect(value.instance.on).toHaveBeenCalledTimes(1);
    expect(value.instance.on).toHaveBeenCalledWith("click", value.handler);
    dispose();
  });

  it("GIVEN an instance with an onclick handler prop WHEN the handler changes THEN the previous listener is removed and the new one is added", () => {
    const { value, dispose } = withTestRoot(() => {
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

    value.setHandler(() => value.handlerB);

    expect(value.instance.off).toHaveBeenCalledTimes(1);
    expect(value.instance.off).toHaveBeenCalledWith("click", value.handlerA);
    expect(value.instance.on).toHaveBeenCalledTimes(2);
    expect(value.instance.on).toHaveBeenLastCalledWith("click", value.handlerB);
    dispose();
  });

  it("GIVEN an onclick handler prop that is unset WHEN bindRuntimeProps reruns THEN it removes the previous listener", () => {
    const { value, dispose } = withTestRoot(() => {
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

    value.setHandler(undefined);

    expect(value.instance.off).toHaveBeenCalledTimes(1);
    expect(value.instance.off).toHaveBeenCalledWith("click", value.handlerA);
    expect(value.instance.on).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("GIVEN a point prop object WHEN bindRuntimeProps is called THEN it sets the point values", () => {
    const { value, dispose } = withTestRoot(() => {
      const instance = new MockPointContainer();

      bindRuntimeProps(instance as any, { position: { x: 3, y: 7 } } as any);

      return { instance };
    });

    expect(value.instance.position.set).toHaveBeenCalledWith(3, 7);
    dispose();
  });

  it("GIVEN a point axis prop WHEN it changes THEN the axis value updates", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect(value.instance.position.x).toBe(4);

    value.setPositionX(9);
    expect(value.instance.position.x).toBe(9);
    dispose();
  });

  it("GIVEN render layer children WHEN bindRuntimeProps is called THEN it attaches the children", () => {
    const { value, dispose } = withTestRoot(() => {
      const instance = new MockRenderLayer();
      const childA = new MockContainer();
      const childB = new MockContainer();

      bindRuntimeProps(instance as any, { children: [childA, childB] } as any);

      return { instance, childA, childB };
    });

    expect(value.instance.attach).toHaveBeenCalledTimes(2);
    expect(value.instance.attach).toHaveBeenNthCalledWith(1, value.childA);
    expect(value.instance.attach).toHaveBeenNthCalledWith(2, value.childB);
    dispose();
  });

  it("GIVEN an invalid prop WHEN bindRuntimeProps is called THEN it does not throw and does not set the property", () => {
    const { value, dispose } = withTestRoot(() => {
      const instance = new MockContainer();

      bindRuntimeProps(instance as any, { notAProp: 1 } as any);

      return { instance };
    });

    expect((value.instance as any).notAProp).toBeUndefined();
    dispose();
  });
});

describe("bindInitialisationProps()", () => {
  it("GIVEN deferred reactive props WHEN bindInitialisationProps is called THEN the instance is not updated on the first run", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect(value.instance.x).toBe(0);
    dispose();
  });

  it("GIVEN deferred reactive props WHEN the prop value changes THEN the instance is updated", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect(value.instance.x).toBe(0);

    value.setX(5);
    expect(value.instance.x).toBe(5);
    dispose();
  });

  it("GIVEN a point prop WHEN bindInitialisationProps is called THEN it defers the initial update", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect(value.instance.position.set).not.toHaveBeenCalled();

    value.setPosition({ x: 8, y: 9 });
    expect(value.instance.position.set).toHaveBeenCalledWith(8, 9);
    dispose();
  });

  it("GIVEN an invalid prop WHEN bindInitialisationProps is called THEN it does not throw and does not set the property after changes", () => {
    const { value, dispose } = withTestRoot(() => {
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

    expect((value.instance as any).notAProp).toBeUndefined();

    value.setProp(2);
    expect((value.instance as any).notAProp).toBeUndefined();
    dispose();
  });
});
