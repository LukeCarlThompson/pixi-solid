# pixi-solid testing utilities

Utilities for testing pixi-solid components and hooks without a live canvas.

```ts
import {
  mountTest,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
} from "pixi-solid/testing";
```

---

## Quick start

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, createTestContext } from "pixi-solid/testing";
import { onTick } from "pixi-solid";

it("calls onTick on each frame", () => {
  const ctx = createTestContext();
  let calls = 0;

  const { dispose } = mountTest(() => (
    <ctx.Provider>
      {onTick(() => { calls++; })}
    </ctx.Provider>
  ));

  ctx.ticker.fastForwardFrames(5);
  expect(calls).toBe(5);

  dispose();
});
```

---

## APIs

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
ctx.renderer.emitResize({ width: 1024 });         // change width only
ctx.renderer.emitResize();                         // re-emit with current dimensions
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

// Advance by number of frames
manual.fastForwardFrames(10);              // 10 frames at 16ms each
manual.fastForwardFrames(5, 33);           // 5 frames at 33ms each (~30fps)

// Advance by time duration
manual.fastForwardTime(1000);              // 1 second in ~16ms steps
manual.fastForwardTime(500, 50);           // 500ms in 50ms steps
```

### `mountTest(setup)`

Mounts JSX or runs Solid code in a temporary root. Returns `{ value, dispose }` where `dispose` destroys the root on cleanup.

**For typed access to rendered JSX, use refs** — the ref callback always receives the correct Pixi type:

```tsx
let container!: Pixi.Container;

const { dispose } = mountTest(() => (
  <Container ref={container} x={10} y={20} />
));

expect(container.x).toBe(10);

dispose();
```

**`value`** is useful for hook results and error testing:

```tsx
const { value: screen } = mountTest(() => usePixiScreen());

expect(() => mountTest(() => usePixiScreen())).toThrow();
```

### `getByLabel(root, label)`

Finds a display object by label (depth-first, first match). Throws if not found.

```ts
let scene!: Pixi.Container;

mountTest(() => (
  <Container ref={scene} label="scene">
    <Sprite label="player" />
  </Container>
));

const player = getByLabel(scene, "player");
expect(player.x).toBe(100);
```

### `queryByLabel(root, label)`

Like `getByLabel` but returns `undefined` instead of throwing.

```ts
const maybe = queryByLabel(scene, "missing");  // undefined
```

### `getAllByLabel(root, label)`

Finds all display objects with the given label. Useful for list items.

```ts
const items = getAllByLabel(scene, "enemy");
expect(items).toHaveLength(3);
```

These query utilities let you decouple tests from the scene graph hierarchy — you find nodes by semantic label rather than by index position.

---

## Cleanup

Call `dispose()` to destroy the Solid root. Wire into your test framework:

```ts
import { afterEach } from "vitest";
import { mountTest } from "pixi-solid/testing";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) dispose();
  disposers.length = 0;
});

const { dispose } = mountTest(() => <ctx.Provider>...</ctx.Provider>);
disposers.push(dispose);
```

---

## Override defaults

```ts
const customTicker = createManualTicker();
vi.spyOn(customTicker.ticker, "add");

const ctx = createTestContext({ ticker: customTicker });
```
