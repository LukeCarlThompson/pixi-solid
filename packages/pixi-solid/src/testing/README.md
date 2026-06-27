# pixi-solid testing utilities

Utilities for testing pixi-solid components and hooks without a live canvas.

```ts
import {
  mountScene,
  createTestRoot,
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

it("calls onTick on each frame", () => {
  const ctx = createTestContext();
  let calls = 0;

  mountScene(() => (
    <ctx.Provider>
      {onTick(() => { calls++; })}
    </ctx.Provider>
  ));

  ctx.ticker.fastForwardFrames(5);
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

### `createTestRoot(setup)`

Runs code in a temporary Solid root and returns the value. Use this for hook and store tests.

```tsx
const ctx = createTestContext();

const { value: screen } = createTestRoot(() => (
  <ctx.Provider>
    {usePixiScreen()}
  </ctx.Provider>
));

expect(screen.width).toBe(800);
```

### `createTestContext()`

Creates mock PixiJS instances and a context provider. Returns `{ Provider, ticker, renderer, app }`.

| Property | Type | Purpose |
|---|---|---|
| `Provider` | Component | Wraps children in mock `PixiAppContext`, `TickerContext`, `ScreenStoreContext` |
| `ticker` | `ManualTicker` | Advance frames with `fastForwardFrames()` or `fastForwardTime()` |
| `renderer` | `TestRenderer` | Simulate resize events with `emitResize()` |
| `app` | `Pixi.Application` | Minimal stub for hooks that call `getPixiApp()` |

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

Creates a stopped ticker with step-based frame advancement.

```ts
const manual = createManualTicker();

manual.fastForwardFrames(10);              // 10 frames at 16ms each
manual.fastForwardFrames(5, 33);           // 5 frames at 33ms each (~30fps)

manual.fastForwardTime(1000);              // 1 second in ~16ms steps
manual.fastForwardTime(500, 50);           // 500ms in 50ms steps
```

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
const maybe = queryByLabel(container, "missing");  // undefined
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

All disposers from `mountScene` and `createTestRoot` are registered automatically.
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
