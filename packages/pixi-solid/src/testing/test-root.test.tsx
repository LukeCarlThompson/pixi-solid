import { createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { afterEach, describe, expect, it } from "vitest";

import { Container } from "../components";
import { onTick } from "../on-tick";
import { usePixiScreen } from "../use-pixi-screen";
import {
  cleanup,
  createTestContext,
  getByLabel,
  mountScene,
  queryByLabel,
  renderHook,
} from "./index";

afterEach(() => {
  cleanup();
});

describe("renderHook", () => {
  it("GIVEN setup throws WHEN creating root THEN cleanup still runs", () => {
    let didCleanup = false;

    expect(() =>
      renderHook(() => {
        onCleanup(() => {
          didCleanup = true;
        });

        throw new Error("setup failed");
      }),
    ).toThrow("setup failed");

    expect(didCleanup).toBe(true);
  });

  it("GIVEN callback returns a number WHEN called THEN result contains the value", () => {
    const { result, dispose } = renderHook(() => 42);

    expect(result()).toBe(42);

    dispose();
  });

  it("GIVEN callback reads an external signal WHEN the signal changes THEN result re-evaluates", () => {
    const [count, setCount] = createSignal(1);

    const { result } = renderHook(() => count());
    expect(result()).toBe(1);

    setCount(2);
    expect(result()).toBe(2);
  });

  it("GIVEN a hook requiring context WHEN run with a wrapper THEN context resolves", () => {
    const ctx = createTestContext();

    const { result } = renderHook(() => usePixiScreen(), { wrapper: ctx.Provider });

    expect(result().width).toBe(800);
    expect(result().height).toBe(600);
  });

  it("GIVEN a hook requiring context WHEN run via ctx.renderHook THEN context resolves", () => {
    const ctx = createTestContext();

    const { result } = ctx.renderHook(() => usePixiScreen());

    expect(result().width).toBe(800);
  });

  it("GIVEN a hook requiring context WHEN no wrapper is provided THEN it throws immediately", () => {
    expect(() => renderHook(() => usePixiScreen())).toThrow(
      "usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas",
    );
  });

  it("GIVEN a store using onTick WHEN frames advance THEN result().time reflects ticks", () => {
    const ctx = createTestContext();

    const { result } = ctx.renderHook(() => {
      const [store, setStore] = createStore({ time: 0 });
      onTick((ticker) => setStore("time", (t) => t + ticker.deltaMS));
      return store;
    });

    expect(result().time).toBe(0);

    ctx.ticker.fastForwardFrames(3);

    expect(result().time).toBe(48);
  });

  it("GIVEN a store using onTick WHEN the root is disposed THEN the ticker listener is removed", () => {
    const ctx = createTestContext();
    let elapsed = 0;

    const { dispose } = ctx.renderHook(() => {
      onTick((ticker) => {
        elapsed += ticker.deltaMS;
      });
      return null;
    });

    ctx.ticker.fastForwardFrames(2);
    expect(elapsed).toBe(32);

    dispose();
    ctx.ticker.fastForwardFrames(2);
    expect(elapsed).toBe(32);
  });
});

describe("mountScene", () => {
  it("GIVEN component throws WHEN rendering THEN cleanup still runs", () => {
    let didCleanup = false;

    const ThrowingComponent = () => {
      onCleanup(() => {
        didCleanup = true;
      });

      throw new Error("render failed");
    };

    expect(() => mountScene(() => <ThrowingComponent />)).toThrow("render failed");

    expect(didCleanup).toBe(true);
  });

  it("GIVEN a Container with x and y WHEN rendered THEN container has typed properties", () => {
    const { container, dispose } = mountScene(() => (
      <Container x={10} y={20} />
    ));

    expect(container.x).toBe(10);
    expect(container.y).toBe(20);

    dispose();
  });

  it("GIVEN a Container with labelled children WHEN rendered THEN getByLabel finds children on container", () => {
    const { container, dispose } = mountScene(() => (
      <Container label="root">
        <Container label="child-a" />
        <Container label="child-b" />
      </Container>
    ));

    expect(getByLabel(container, "child-a")).toBeDefined();
    expect(getByLabel(container, "child-b")).toBeDefined();
    expect(queryByLabel(container, "missing")).toBeUndefined();
    expect(() => getByLabel(container, "missing")).toThrow();

    dispose();
  });

  it("GIVEN container is accessed via return value THEN properties are directly accessible (no ref callback needed)", () => {
    const { container } = mountScene(() => (
      <Container label="scene">
        <Container label="child" x={50} />
      </Container>
    ));

    // Root properties directly accessible
    expect(container.label).toBe("scene");

    // Children accessible via getByLabel
    expect(getByLabel(container, "child").x).toBe(50);
  });
});

describe("cleanup", () => {
  it("GIVEN cleanup is wired in afterEach THEN disposers run automatically", () => {
    let disposed = false;

    renderHook(() => {
      onCleanup(() => {
        disposed = true;
      });
      return undefined;
    });

    // cleanup runs in afterEach — after the test, disposed should be true
    // We verify by calling cleanup manually here
    cleanup();
    expect(disposed).toBe(true);
  });
});

describe("mountScene stability and reactivity", () => {
  /**
   * mountScene calls setup() exactly once inside createRoot.
   * These tests verify the behavioural contract:
   * - setup runs once and the container is stable
   * - signal changes propagate reactively via bindRuntimeProps
   * - the container is never destroyed / swapped on signal changes
   */
  it("GIVEN mountScene reads external signals in JSX WHEN signals change THEN container stays stable and properties update reactively", () => {
    const [label, setLabel] = createSignal("first");

    const { container } = mountScene(() => (
      <Container label={label()} />
    ));

    expect(container.label).toBe("first");

    // Signal changes after mount — properties update via bindRuntimeProps effects
    setLabel("second");

    // Same container instance, not destroyed
    expect(container.label).toBe("second");
    expect(container.destroyed).toBe(false);
  });

  it("GIVEN mountScene with no external signals THEN setup runs once and container is stable", () => {
    let calls = 0;

    const { container, dispose } = mountScene(() => {
      calls++;
      return <Container x={10} y={20} />;
    });

    expect(calls).toBe(1);
    expect(container.x).toBe(10);
    expect(container.y).toBe(20);

    dispose();
    expect(container.destroyed).toBe(true);
  });

  it("GIVEN mountScene setup reads reactive signals in props WHEN signals change THEN instance properties update reactively via bindRuntimeProps, container stays stable, setup does NOT re-run", () => {
    // bindRuntimeProps uses createRenderEffect to subscribe to props.
    // So even though setup only runs once inside createRoot, the existing
    // instance's properties update reactively via SolidJS's effect system.
    // The container stays stable (same instance), and no new instances are created.
    const [x, setX] = createSignal(10);
    const [label, setLabel] = createSignal("first");
    let setupCalls = 0;

    const { container } = mountScene(() => {
      setupCalls++;
      return <Container x={x()} label={label()} />;
    });

    expect(container.x).toBe(10);
    expect(container.label).toBe("first");
    expect(setupCalls).toBe(1);

    // Change signal — container stays the same, but the instance updates reactively
    setX(50);
    setLabel("second");

    // Setup did NOT re-run (createRoot callback only executes once)
    expect(setupCalls).toBe(1);

    // Container is the SAME instance
    // But properties updated reactively via render effects
    expect(container.x).toBe(50);
    expect(container.label).toBe("second");

    // The instance was never destroyed — it's the same alive instance
    expect(container.destroyed).toBe(false);
  });
});
