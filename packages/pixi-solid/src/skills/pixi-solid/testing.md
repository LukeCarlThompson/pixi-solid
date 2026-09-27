---
name: testing
description: Testing patterns for pixi-solid components and hooks using mountScene, renderHook, createTestContext, and createManualTicker. Covers scene graph queries, container-based typed access, and cleanup patterns.
---

# Testing pixi-solid

This reference covers the test helpers that `pixi-solid/testing` exports and the pixi-solid contexts they provide.

## Quick reference

| Utility                          | Purpose                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `mountScene(setup, options?)`    | Mount a scene graph and return `{ container, getByLabel, queryByLabel, getAllByLabel, dispose }`              |
| `renderHook(callback, options?)` | Run a hook/store **once** in a temporary root, optionally inside a provider, and return `{ result, dispose }` |
| `createTestContext()`            | One-stop mock provider with ticker, renderer, app, and bound `mount`/`renderHook`                             |
| `createManualTicker()`           | Stopped ticker with step-based frame advancement                                                              |
| `getByLabel(root, label)`        | Find a node by label (throws if not found)                                                                    |
| `queryByLabel(root, label)`      | Find a node by label (returns `undefined` if not found)                                                       |
| `getAllByLabel(root, label)`     | Find all nodes with the given label                                                                           |

```ts
import {
  mountScene,
  renderHook,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
} from "pixi-solid/testing";
```

## Cleanup setup

`mountScene` and `renderHook` register disposers. Add this once in your test setup to clean up after each test:

```ts
import { afterEach } from "vitest";
import { cleanup } from "pixi-solid/testing";

afterEach(cleanup);
```

`cleanup()` disposes every registered root **and clears Solid 2's error halt**. Solid 2 stops the whole reactive system after an uncaught error. Without the reset, one test that throws on purpose would break every later test in the file.

## mountScene

`mountScene(setup, options?)` mounts JSX in a temporary Solid root. It returns the root Pixi node and query helpers bound to that node. It does not create application or ticker context. When the component needs context, pass `options.wrapper` (usually `ctx.Provider`) or use `createTestContext`.

```tsx
import type * as Pixi from "pixi.js";

type MountSceneResult<TRoot = Pixi.Container> = {
  container: TRoot;
  getByLabel: (label: string) => Pixi.Container;
  queryByLabel: (label: string) => Pixi.Container | undefined;
  getAllByLabel: (label: string) => Pixi.Container[];
  dispose: () => void;
};
```

The returned `container` is the root PixiJS node. Access its properties directly. The bound `getByLabel`/`queryByLabel`/`getAllByLabel` query relative to `container`, so you do not have to pass the root around. You do not need a ref callback.

### Basic component test

```tsx
import { describe, expect, it } from "vitest";
import { mountScene } from "pixi-solid/testing";
import { Container, Sprite } from "pixi-solid";

describe("scene", () => {
  it("positions a sprite", () => {
    const { container, getByLabel } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" x={100} />
      </Container>
    ));

    // Container is Pixi.Container — no ref callback needed
    expect(container.label).toBe("scene");
    expect(getByLabel("player").x).toBe(100);
  });
});
```

### Testing a ticker-dependent component

Mount a component under a provider so its `onTick` call sees ticker context. Pass the provider as `wrapper`, or use `ctx.mount`, which applies `ctx.Provider` for you:

```tsx
import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import { Container, onTick, Sprite } from "pixi-solid";
import { createTestContext } from "pixi-solid/testing";
import { Texture } from "pixi.js";

function TickerDrivenSprite() {
  const [x, setX] = createSignal(0);
  onTick((ticker) => setX((current) => current + ticker.deltaMS));

  return <Sprite label="moving" texture={Texture.WHITE} x={x()} />;
}

describe("ticker-dependent component", () => {
  it("GIVEN a mounted scene WHEN five ticker frames advance THEN sprite position reflects elapsed time", async () => {
    // GIVEN
    const ctx = createTestContext();
    const { getByLabel, dispose } = ctx.mount(() => (
      <Container label="scene">
        <TickerDrivenSprite />
      </Container>
    ));
    const sprite = getByLabel("moving");

    // WHEN
    await ctx.ticker.fastForwardFrames(5);

    // THEN
    expect(sprite.x).toBe(80);
    dispose();
  });
});
```

The explicit form passes the provider to `wrapper` instead:

```tsx
const ctx = createTestContext();

const { getByLabel } = mountScene(
  () => (
    <Container label="scene">
      <TickerDrivenSprite />
    </Container>
  ),
  { wrapper: ctx.Provider },
);
```

### Typing a specific component root

`mountScene` defaults its root type to `Pixi.Container`. Specify a component's instance type when you need class-specific properties:

```tsx
import { AnimatedSprite } from "pixi-solid";
import { Texture } from "pixi.js";
import type * as Pixi from "pixi.js";
import { mountScene } from "pixi-solid/testing";

const { container } = mountScene<Pixi.AnimatedSprite>(() => (
  <AnimatedSprite textures={[Texture.WHITE]} playing autoUpdate={false} />
));

container.playing; // typed as Pixi.AnimatedSprite
```

## renderHook

`renderHook<T>(callback, options?)` runs a hook (or store factory) **once** in a temporary Solid root and exposes its return value. Use this for hook and store tests.

```tsx
import type { Accessor } from "solid-js";

type RenderHookResult<T> = {
  result: Accessor<T>; // call result() to read the current value
  dispose: () => void;
};
```

The callback runs once inside an optional `wrapper`. It does **not** re-run when reactive values change. To observe updates, return a reactive value from the callback (an accessor or a store) and read it through `result()`. Hooks that register side effects (`onTick`, `onResize`) are cleaned up on `dispose`.

Errors thrown while the callback runs surface synchronously from `renderHook`. A missing-context test can therefore use a plain `expect(() => renderHook(...)).toThrow()`.

### Testing hooks with context

Hooks like `usePixiScreen` require a provider. Pass `ctx.Provider` as the wrapper, or use the `ctx.renderHook` convenience method:

```tsx
import { describe, expect, it } from "vitest";
import { renderHook, createTestContext } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("usePixiScreen", () => {
  it("returns the screen dimensions from context", () => {
    const ctx = createTestContext();

    const { result } = renderHook(() => usePixiScreen(), {
      wrapper: ctx.Provider,
    });

    expect(result().width).toBe(800);
    expect(result().height).toBe(600);
  });
});
```

`ctx.renderHook` is equivalent. The mock `Provider` is applied automatically:

```tsx
const ctx = createTestContext();
const { result } = ctx.renderHook(() => usePixiScreen());
expect(result().width).toBe(800);
```

### Testing stores that use hooks internally

Return a reactive store object, then read through `result()`:

```tsx
const ctx = createTestContext();

const { result } = ctx.renderHook(() => createClockStore()); // uses onTick internally

expect(result().time).toBe(0);

await ctx.ticker.fastForwardFrames(3);
expect(result().time).toBe(48);
```

> **Note:** the ticker driver methods (`fastForwardFrames`, `fastForwardTime`) are **async**. Always `await` them. They flush microtasks after every tick. A promise-based continuation (an awaited `createAsyncDelay`, an animation `onEnded` chain) therefore receives later ticks without a manual `await Promise.resolve()` in the test. Successive calls are additive, because they share one monotonic absolute clock.

### Reactivity

The callback runs once, so `result` does not re-evaluate on its own. Return a reactive value from the callback and read it through `result()` to observe updates:

```tsx
import { flush } from "solid-js";

const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());
expect(result().width).toBe(800);

ctx.renderer.emitResize({ width: 1024 });
flush();

expect(result().width).toBe(1024);
```

Solid 2 batches reactive writes and flushes them on a microtask. An assertion that runs immediately after a write can therefore still see the previous value. Call `flush()` before asserting to apply pending work synchronously.

> **Tip:** return stable reactive objects (stores, screen dimensions) rather than deriving primitives inside the callback. A derived primitive is read only once, so later changes would not be visible through `result()`.

### Error testing

Errors surface eagerly at `renderHook()` call time, so missing-context tests read cleanly:

```tsx
import { describe, expect, it } from "vitest";
import { renderHook } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("usePixiScreen error", () => {
  it("throws when used outside a provider", () => {
    expect(() => renderHook(() => usePixiScreen())).toThrow();
  });
});
```

## Flushing updates

Solid 2 batches reactive writes and flushes them on a microtask. An assertion that runs immediately after a write can therefore still see the previous value. Call `flush()` from `solid-js` to apply pending work synchronously before asserting:

```tsx
import { createSignal, flush } from "solid-js";
import { mountScene } from "pixi-solid/testing";
import { Sprite } from "pixi-solid";

const [x, setX] = createSignal(0);
const { container } = mountScene(() => <Sprite x={x()} />);

setX(100);
flush();

expect(container.x).toBe(100);
```

`flush()` is deterministic. It asserts that the reactive system applied the change, not that the change eventually becomes true. Prefer it over polling or retry helpers, which can hide an extra async step or a leaked effect instead of failing the test.

The test helpers already flush where they need to. `mountScene` and `renderHook` flush after mounting, and the manual ticker flushes microtasks after every frame.

## createTestContext

Creates mock PixiJS contexts for testing. Returns `{ Provider, ticker, renderer, app, mount, renderHook }`.

```tsx
import { createTestContext } from "pixi-solid/testing";

const ctx = createTestContext();

const { getByLabel } = ctx.mount(() => <MyComponent />);
```

| Property     | Type                             | Purpose                                                                              |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------ |
| `Provider`   | Component                        | Wraps children in mock `PixiAppContext`, `TickerContext`, `ScreenStoreContext`       |
| `ticker`     | `ManualTicker`                   | Advance frames with `await fastForwardFrames()` or `await fastForwardTime()`         |
| `renderer`   | `TestRenderer`                   | Simulate resize events with `emitResize()`                                           |
| `app`        | `Pixi.Application`               | Minimal stub for hooks that call `getPixiApp()`                                      |
| `mount`      | `(setup) => MountSceneResult`    | `mountScene(setup, { wrapper: Provider })` — mounts a scene inside the mock contexts |
| `renderHook` | `(callback) => RenderHookResult` | `renderHook(callback, { wrapper: Provider })` — runs hooks inside the mock contexts  |

### Simulating resize

```tsx
import { flush } from "solid-js";
import { describe, expect, it } from "vitest";
import { createTestContext } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("resize handling", () => {
  it("updates on emitResize", () => {
    const ctx = createTestContext();

    const { result } = ctx.renderHook(() => usePixiScreen());

    expect(result().width).toBe(800);

    ctx.renderer.emitResize({ width: 1024 });
    flush();

    expect(result().width).toBe(1024);
  });
});
```

### Spying on mocks

All mocks are plain objects. Spy with any framework:

```tsx
const addSpy = vi.spyOn(ctx.ticker.ticker, "add");
const resizeSpy = vi.spyOn(ctx.renderer, "addListener");
```

### Override defaults

```tsx
const customTicker = createManualTicker();
vi.spyOn(customTicker.ticker, "add");

const ctx = createTestContext({ ticker: customTicker });
```

## createManualTicker

Creates a stopped `Pixi.Ticker` with step-based frame advancement. The ticker starts stopped, so you control exactly when frames advance.

```ts
import { createManualTicker } from "pixi-solid/testing";

const manual = createManualTicker();
let calls = 0;

manual.ticker.add(() => {
  calls++;
});

// Advance by number of frames (methods are async — await them)
await manual.fastForwardFrames(10); // 10 frames at 16ms each
await manual.fastForwardFrames(5, 33); // 5 frames at 33ms each (~30fps)
expect(calls).toBe(15);

// Advance by time duration
await manual.fastForwardTime(1000); // 1 second in ~16ms steps
await manual.fastForwardTime(500, 50); // 500ms in 50ms steps
```

The drivers own a monotonic absolute clock, so successive calls are exactly additive. `await fastForwardTime(100)` followed by `await fastForwardTime(50)` delivers 100ms then 50ms of accumulated `deltaMS`, with no dropped first frame.

> **Note:** the returned `ticker` wraps a real PixiJS `Ticker`, so the same defaults apply. For example, the default `minFPS = 10` caps each step delta at 100ms. You can override the defaults on the instance after creation, for example `manual.ticker.minFPS = 4` to allow larger step deltas.

Step-based advancement avoids the problem of a single large delta, which can break spring physics, smooth-damp interpolation, or sequenced animations.

## Scene graph queries

Use query helpers to find nodes by `label`, instead of navigating `.children[index]` paths. `mountScene` returns them bound to the mounted root. The standalone `getByLabel(root, label)` form works on any Pixi container.

```tsx
import { describe, expect, it } from "vitest";
import { mountScene } from "pixi-solid/testing";
import { Container, Sprite } from "pixi-solid";

describe("getByLabel", () => {
  it("finds a child sprite by label", () => {
    const { getByLabel } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" x={100} y={200} />
        <Sprite label="enemy" x={300} y={400} />
      </Container>
    ));

    expect(getByLabel("player").x).toBe(100);
  });

  it("returns undefined for missing labels with queryByLabel", () => {
    const { getByLabel, queryByLabel } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" />
      </Container>
    ));

    expect(queryByLabel("boss")).toBeUndefined();
    expect(() => getByLabel("boss")).toThrow();
  });
});
```

`getAllByLabel(label)` returns every match, which is useful when a scene repeats a label:

```tsx
const { getAllByLabel } = mountScene(() => (
  <Container label="scene">
    <Sprite label="enemy" />
    <Sprite label="enemy" />
  </Container>
));

expect(getAllByLabel("enemy")).toHaveLength(2);
```

## Testing createAsyncDelay

```tsx
import { describe, expect, it } from "vitest";
import { createTestContext } from "pixi-solid/testing";
import { createAsyncDelay } from "pixi-solid/utils";

describe("createAsyncDelay", () => {
  it("resolves after the requested time passes on the ticker", async () => {
    const ctx = createTestContext();
    let delay!: (ms: number, signal?: AbortSignal) => Promise<void>;

    ctx.renderHook(() => {
      delay = createAsyncDelay();
    });

    const controller = new AbortController();
    const promise = delay(500, controller.signal);

    // Advance half the time — still pending
    await ctx.ticker.fastForwardTime(250);

    // Advance remaining time — resolves
    await ctx.ticker.fastForwardTime(250);
    await promise;
  });

  it("resolves when aborted", async () => {
    const ctx = createTestContext();
    let delay!: (ms: number, signal?: AbortSignal) => Promise<void>;

    ctx.renderHook(() => {
      delay = createAsyncDelay();
    });

    const controller = new AbortController();
    const promise = delay(1000, controller.signal);
    controller.abort();

    await expect(promise).resolves.toBeUndefined();
  });
});
```

## Manual cleanup

Use each helper's returned `dispose()` when you do not install the global `afterEach(cleanup)` setup. Calling `dispose()` unregisters that root, so later global cleanup will not dispose it twice.

## jsdom / renderer caveats

- jsdom does not provide WebGL contexts. Tests that rely on WebGL-only renderer features should either mock Pixi renderer behavior or run in an environment that supports WebGL.
- For most logic that depends on ticks (animations, timers, callbacks), the testing utilities in `pixi-solid/testing` do not need a real canvas at all.

## Practical notes

- Do not call `ticker.start()` in tests. Advance frames with the manual ticker.
- Use `getByLabel` instead of `.children[index]` to keep tests independent of child order.
- Dispose roots after testing resource cleanup. Mocks are plain objects, and you can spy on them with your test framework.
