import {
  createComponent,
  createContext,
  createRoot,
  createSignal,
  flush,
  getOwner,
  onSettled,
  useContext,
} from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { renderHook } from "../testing";

import { bindInitialisationProps, bindRuntimeProps } from "./bind-props";

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
      flush();

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
      flush();

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
      flush();

      return { child, childRef, childParentAtRefTime };
    });

    // The ref should have been called
    expect(result().childRef).toHaveBeenCalledWith(result().child);
    // And the parent should be set when the ref is called
    expect(result().childParentAtRefTime).toBe(null);
    dispose();
  });

  it("GIVEN a ref array WHEN bindRuntimeProps is called THEN every callback receives the instance", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const first = vi.fn();
      const second = vi.fn();

      bindRuntimeProps(instance as any, { ref: [first, [second]] } as any);
      flush();

      return { instance, first, second };
    });

    expect(result().first).toHaveBeenCalledWith(result().instance);
    expect(result().second).toHaveBeenCalledWith(result().instance);
    dispose();
  });

  it("GIVEN a ref callback WHEN it runs THEN it has no owner, so context is unavailable", () => {
    const TestContext = createContext<string>();
    const instance = new MockContainer();
    let owner: unknown = "not-called";
    let thrown: unknown;

    const ref = vi.fn(() => {
      owner = getOwner();

      try {
        useContext(TestContext);
      } catch (error) {
        thrown = error;
      }
    });

    const { dispose } = renderHook(
      () => {
        bindRuntimeProps(instance as any, { ref } as any);
      },
      {
        wrapper: (wrapperProps) =>
          createComponent(TestContext, {
            value: "test-value",
            get children() {
              return wrapperProps.children;
            },
          }),
      },
    );

    expect(ref).toHaveBeenCalledWith(instance);
    // A ref callback is unowned, matching @solidjs/web. Move context reads and
    // cleanup to `onSettled` in the component body.
    expect(owner).toBeNull();
    expect(thrown).toBeInstanceOf(Error);
    dispose();
  });

  it("GIVEN a context-dependent ref WHEN the work moves to onSettled THEN the context is available", () => {
    const TestContext = createContext<string>();
    let contextValue: string | undefined;
    let refValue: MockContainer | undefined;

    const { dispose } = renderHook(
      () => {
        const instance = new MockContainer();

        onSettled(() => {
          contextValue = useContext(TestContext);
        });

        bindRuntimeProps(
          instance as any,
          {
            ref: (value: MockContainer) => {
              refValue = value;
            },
          } as any,
        );

        return { instance };
      },
      {
        wrapper: (wrapperProps) =>
          createComponent(TestContext, {
            value: "test-value",
            get children() {
              return wrapperProps.children;
            },
          }),
      },
    );

    expect(contextValue).toBe("test-value");
    expect(refValue).toBeDefined();
    dispose();
  });

  it("GIVEN a ref callback WHEN the effect settles THEN the ref value is available", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      let refValue: MockContainer | undefined;
      const state: { refValueAtSettle?: MockContainer } = {};

      const ref = vi.fn((value: MockContainer) => {
        refValue = value;
      });

      onSettled(() => {
        state.refValueAtSettle = refValue;
      });

      bindRuntimeProps(instance as any, { ref } as any);

      return { instance, ref, state };
    });

    expect(result().ref).toHaveBeenCalledWith(result().instance);
    expect(result().state.refValueAtSettle).toBe(result().instance);
    dispose();
  });

  it("GIVEN an instance and an onclick handler prop WHEN bindRuntimeProps is called THEN it adds the event listener", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const handler = vi.fn();

      bindRuntimeProps(instance as any, { onclick: handler } as any);
      flush();

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
      const [handler, setHandler] = createSignal(() => handlerA);

      const props = {
        get onclick() {
          return handler();
        },
      };

      bindRuntimeProps(instance as any, props as any);
      flush();

      return { instance, handlerA, handlerB, setHandler };
    });

    result().setHandler(() => result().handlerB);
    flush();

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
      const [handler, setHandler] = createSignal<(() => void) | undefined>(() => handlerA);

      const props = {
        get onclick() {
          return handler();
        },
      };

      bindRuntimeProps(instance as any, props as any);
      flush();

      return { instance, handlerA, setHandler };
    });

    result().setHandler(undefined);
    flush();

    expect(result().instance.off).toHaveBeenCalledTimes(1);
    expect(result().instance.off).toHaveBeenCalledWith("click", result().handlerA);
    expect(result().instance.on).toHaveBeenCalledTimes(1);
    dispose();
  });

  it("GIVEN a bound event handler WHEN the owner is disposed THEN the listener is removed", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockContainer();
      const handler = vi.fn();

      bindRuntimeProps(instance as any, { onclick: handler } as any);
      flush();

      return { instance, handler };
    });

    dispose();

    expect(result().instance.off).toHaveBeenCalledWith("click", result().handler);
  });

  it("GIVEN a point prop object WHEN bindRuntimeProps is called THEN it sets the point values", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockPointContainer();

      bindRuntimeProps(instance as any, { position: { x: 3, y: 7 } } as any);
      flush();

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
      flush();

      return { instance, setPositionX };
    });

    expect(result().instance.position.x).toBe(4);

    result().setPositionX(9);
    flush();
    expect(result().instance.position.x).toBe(9);
    dispose();
  });

  it("GIVEN render layer children WHEN bindRuntimeProps is called THEN it attaches the children", () => {
    const { result, dispose } = renderHook(() => {
      const instance = new MockRenderLayer();
      const childA = new MockContainer();
      const childB = new MockContainer();

      bindRuntimeProps(instance as any, { children: [childA, childB] } as any);
      flush();

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
      flush();

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
      flush();

      return { instance };
    });

    expect(result().instance.x).toBe(0);
    dispose();
  });

  it("GIVEN deferInitialRun false WHEN bindInitialisationProps is called THEN the initial values are applied", () => {
    const instance = new MockContainer();

    createRoot((dispose) => {
      bindInitialisationProps(instance as any, { x: 8, y: 9 } as any, new Set<string>(), {
        deferInitialRun: false,
      });

      flush();

      expect(instance.x).toBe(8);
      expect(instance.y).toBe(9);
      dispose();
    });
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
      flush();

      return { instance, setX };
    });

    expect(result().instance.x).toBe(0);

    result().setX(5);
    flush();
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
      flush();

      return { instance, setPosition };
    });

    expect(result().instance.position.set).not.toHaveBeenCalled();

    result().setPosition({ x: 8, y: 9 });
    flush();
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
      flush();

      return { instance, setProp };
    });

    expect((result().instance as any).notAProp).toBeUndefined();

    result().setProp(2);
    expect((result().instance as any).notAProp).toBeUndefined();
    dispose();
  });
});
