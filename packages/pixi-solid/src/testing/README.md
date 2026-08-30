# pixi-solid testing utilities

Utilities for testing pixi-solid components and hooks without a live canvas.

```ts
import {
  mountScene,
  renderHook,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
  cleanup,
} from "pixi-solid/testing";
```

---

## Quick start

```tsx
import { afterEach, describe, expect, it } from "vitest";
import { mountScene, createTestContext, cleanup } from "pixi-solid/testing";
import { onTick } from "pixi-solid";

afterEach(() => cleanup());

it("calls onTick on each frame", async () => {
  const ctx = createTestContext();
  let calls = 0;

  mountScene(() => (
    <ctx.Provider>
      {onTick(() => {
        calls++;
      })}
    </ctx.Provider>
  ));

  await ctx.ticker.fastForwardFrames(5);
  expect(calls).toBe(5);
});
```

---

## APIs

### `mountScene(setup)`

Mounts JSX in a temporary Solid root and returns the root Container. Use this for component tests.

```tsx
const { container, dispose } = mountScene(() => (
  <Container label="scene" x={10}>
    <Sprite label="player" />
  </Container>
));

// Container is Pixi.Container — no ref callback needed
container.x;
const player = getByLabel(container, "player");
```

For non-Container roots (e.g. AnimatedSprite), specify the type via generic:

```tsx
const { container } = mountScene<Pixi.AnimatedSprite>(() => (
  <AnimatedSprite textures={textures} playing />
));
container.playing;
```

### `renderHook(callback, options?)`

Runs a hook (or store factory) in a temporary Solid root and exposes its return value as a reactive accessor. Use this for hook and store tests.

```tsx
type RenderHookResult<T> = {
  result: Accessor<T>; // call result() to read the current value
  dispose: () => void;
};
```

The callback runs exactly once inside an optional `wrapper`, so hooks that register side effects (`onTick`, `onResize`) are cleaned up on dispose. If the callback reads reactive values, `result` re-evaluates when they change.

**With a context provider** (e.g. `usePixiScreen`, which requires `ScreenStoreContext`):

```tsx
const ctx = createTestContext();

const { result } = renderHook(() => usePixiScreen(), {
  wrapper: ctx.Provider,
});

expect(result().width).toBe(800);

ctx.renderer.emitResize({ width: 1024 });
expect(result().width).toBe(1024);
```

**Or use the `ctx.renderHook` convenience method** — same thing, wrapper implied:

```tsx
const ctx = createTestContext();

const { result } = ctx.renderHook(() => usePixiScreen());
```

**Testing a store that uses hooks internally** — return a reactive store object, then read through `result()`:

```tsx
const ctx = createTestContext();

const { result } = ctx.renderHook(() => createClockStore()); // uses onTick internally

expect(result().time).toBe(0);

ctx.ticker.fastForwardFrames(3);
expect(result().time).toBe(48);
```

> **Note:** the ticker driver methods (`fastForwardFrames`, `fastForwardTime`) are **async** — always `await` them. They flush microtasks after every tick so promise-based continuations (awaited `delay`, animation `onEnded` chains) receive subsequent ticks without manual flushing in tests. Successive calls are additive: they share one monotonic absolute clock.

**Error testing** (missing context throws eagerly, at `renderHook()` call time):

```tsx
expect(() => renderHook(() => usePixiScreen())).toThrow();
```

> **Tip:** return stable reactive objects (stores, screen dimensions) rather than deriving primitives inside the callback. Derived primitives re-run the callback when they change, which re-creates any state created inside it.

### `createTestContext()`

Creates mock PixiJS instances and a context provider. Returns `{ Provider, ticker, renderer, app, renderHook }`.

| Property     | Type                             | Purpose                                                                             |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------- |
| `Provider`   | Component                        | Wraps children in mock `PixiAppContext`, `TickerContext`, `ScreenStoreContext`      |
| `ticker`     | `ManualTicker`                   | Advance frames with `await fastForwardFrames()` or `await fastForwardTime()`        |
| `renderer`   | `TestRenderer`                   | Simulate resize events with `emitResize()`                                          |
| `app`        | `Pixi.Application`               | Minimal stub for hooks that call `getPixiApp()`                                     |
| `renderHook` | `(callback) => RenderHookResult` | `renderHook(callback, { wrapper: Provider })` — runs hooks inside the mock contexts |

**Simulating resize:**

```ts
ctx.renderer.emitResize({ width: 1024 });
ctx.renderer.emitResize();
```

**Spying on mocks (use your framework's spy):**

```ts
const addSpy = vi.spyOn(ctx.ticker.ticker, "add");
const resizeSpy = vi.spyOn(ctx.renderer, "addListener");
```

### `createManualTicker()`

Creates a stopped ticker with step-based frame advancement. The driver methods are **async** and must be awaited.

```ts
const manual = createManualTicker();

await manual.fastForwardFrames(10); // 10 frames at 16ms each
await manual.fastForwardFrames(5, 33); // 5 frames at 33ms each (~30fps)

await manual.fastForwardTime(1000); // 1 second in ~16ms steps
await manual.fastForwardTime(500, 50); // 500ms in 50ms steps
```

Because the drivers own a monotonic absolute clock, successive calls are exactly additive — `await fastForwardTime(100)` then `await fastForwardTime(50)` delivers 100ms then 50ms of accumulated `deltaMS` with no dropped first frame.

> **Note:** the returned `ticker` wraps a real PixiJS `Ticker`, so the same defaults apply (e.g. per-step deltas are capped at 100ms via the default `minFPS = 10`) and can be overridden on the instance after creation — e.g. `ticker.ticker.minFPS = 4` to allow larger step deltas.

### `getByLabel(root, label)`

Finds a display object by label (depth-first, first match). Throws if not found.

```ts
const { container } = mountScene(() => (
  <Container label="scene">
    <Sprite label="player" />
  </Container>
));

const player = getByLabel(container, "player");
expect(player.x).toBe(100);
```

### `queryByLabel(root, label)`

Like `getByLabel` but returns `undefined` instead of throwing.

```ts
const maybe = queryByLabel(container, "missing"); // undefined
```

### `getAllByLabel(root, label)`

Finds all display objects with the given label. Useful for list items.

```ts
const items = getAllByLabel(container, "enemy");
expect(items).toHaveLength(3);
```

---

## Cleanup

Wire `cleanup()` into your test framework's lifecycle:

```ts
import { afterEach } from "vitest";
import { cleanup } from "pixi-solid/testing";

afterEach(() => cleanup());
```

All disposers from `mountScene` and `renderHook` are registered automatically.
No need to track `dispose` manually.

To disable automatic cleanup for a specific test, call `dispose()` directly:

```ts
const { dispose } = mountScene(() => <Container />);
// ... test logic ...
dispose(); // cleanup() won't double-dispose
```

---

## Override defaults

```ts
const customTicker = createManualTicker();
vi.spyOn(customTicker.ticker, "add");

const ctx = createTestContext({ ticker: customTicker });
```
