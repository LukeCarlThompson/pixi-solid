---
name: testing
description: Testing patterns for pixi-solid components and hooks using mountTest, createTestContext, and createManualTicker. Covers scene graph queries, ref-based typed access, and cleanup patterns.
---

# Testing pixi-solid

This subskill documents recommended patterns for unit testing code that uses `pixi-solid`.

## Quick reference

| Utility | Purpose |
|---|---|
| `mountTest(setup)` | Mount JSX or run Solid code in a temporary root |
| `createTestContext()` | One-stop mock provider with ticker, renderer, and app |
| `createManualTicker()` | Stopped ticker with step-based frame advancement |
| `getByLabel(root, label)` | Find a node by label (throws if not found) |
| `queryByLabel(root, label)` | Find a node by label (returns `undefined` if not found) |
| `getAllByLabel(root, label)` | Find all nodes with the given label |

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

## mountTest

`mountTest(setup)` mounts JSX or runs Solid code in a temporary root. Returns `{ value, dispose }`.

### Rendering components with onTick

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, createTestContext } from "pixi-solid/testing";
import { onTick } from "pixi-solid";

describe("Component with onTick", () => {
  it("calls the tick callback each frame", () => {
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
});
```

### Typed access with refs

JSX always returns `JSX.Element` at the type level, erasing Pixi instance types. **Use refs for typed access** — the ref callback always receives the correct type:

```tsx
import { describe, expect, it } from "vitest";
import { mountTest } from "pixi-solid/testing";
import { Container } from "pixi-solid";
import type * as Pixi from "pixi.js";

describe("typed ref access", () => {
  it("lets you assert on typed Pixi properties", () => {
    let container!: Pixi.Container;

    const { dispose } = mountTest(() => (
      <Container ref={container} x={10} y={20} />
    ));

    expect(container.x).toBe(10);
    expect(container.y).toBe(20);

    dispose();
  });
});
```

### Using value for hook results

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, createTestContext } from "pixi-solid/testing";

describe("usePixiScreen", () => {
  it("returns the screen dimensions from context", () => {
    const ctx = createTestContext();

    const { value: screen } = mountTest(() => (
      <ctx.Provider>
        {usePixiScreen()}
      </ctx.Provider>
    ));

    expect(screen.width).toBe(800);
    expect(screen.height).toBe(600);
  });
});
```

### Error testing

```tsx
import { describe, expect, it } from "vitest";
import { mountTest } from "pixi-solid/testing";

describe("usePixiScreen error", () => {
  it("throws when used outside a provider", () => {
    expect(() => mountTest(() => usePixiScreen())).toThrow();
  });
});
```

## createTestContext

Creates mock PixiJS contexts for testing. Returns `{ Provider, ticker, renderer, app }`.

```tsx
import { createTestContext, mountTest } from "pixi-solid/testing";

const ctx = createTestContext();

const { dispose } = mountTest(() => (
  <ctx.Provider>
    <MyComponent />
  </ctx.Provider>
));
```

| Property | Type | Purpose |
|---|---|---|
| `Provider` | Component | Wraps children in mock `PixiAppContext`, `TickerContext`, `ScreenStoreContext` |
| `ticker` | `ManualTicker` | Advance frames with `fastForwardFrames()` or `fastForwardTime()` |
| `renderer` | `TestRenderer` | Simulate resize events with `emitResize()` |
| `app` | `Pixi.Application` | Minimal stub for hooks that call `getPixiApp()` |

### Simulating resize

```tsx
import { describe, expect, it } from "vitest";

describe("resize handling", () => {
  it("updates on emitResize", () => {
    const ctx = createTestContext();

    const { value: screen } = mountTest(() => (
      <ctx.Provider>
        {usePixiScreen()}
      </ctx.Provider>
    ));

    expect(screen.width).toBe(800);

    ctx.renderer.emitResize({ width: 1024 });

    expect(screen.width).toBe(1024);
  });
});
```

### Spying on mocks

All mocks are plain objects — spy with any framework:

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

Creates a stopped `Pixi.Ticker` with step-based frame advancement. The ticker starts stopped so you control exactly when frames advance.

```ts
import { createManualTicker } from "pixi-solid/testing";

const manual = createManualTicker();
let calls = 0;

manual.ticker.add(() => { calls++; });

// Advance by number of frames
manual.fastForwardFrames(10);              // 10 frames at 16ms each
manual.fastForwardFrames(5, 33);           // 5 frames at 33ms each (~30fps)
expect(calls).toBe(15);

// Advance by time duration
manual.fastForwardTime(1000);              // 1 second in ~16ms steps
manual.fastForwardTime(500, 50);           // 500ms in 50ms steps
```

Step-based advancement avoids the footgun of single large deltas that can break spring physics, smooth-damp interpolation, or sequenced animations.

## Scene graph queries

Use query helpers to find nodes by `label` instead of navigating `.children[index]` paths.

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, getByLabel, queryByLabel } from "pixi-solid/testing";
import { Container, Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";

describe("getByLabel", () => {
  it("finds a child sprite by label", () => {
    let scene!: Pixi.Container;

    mountTest(() => (
      <Container ref={scene} label="scene">
        <Sprite label="player" x={100} y={200} />
        <Sprite label="enemy" x={300} y={400} />
      </Container>
    ));

    const player = getByLabel(scene, "player");
    expect(player.x).toBe(100);
  });

  it("returns undefined for missing labels with queryByLabel", () => {
    let scene!: Pixi.Container;

    mountTest(() => (
      <Container ref={scene} label="scene">
        <Sprite label="player" />
      </Container>
    ));

    expect(queryByLabel(scene, "boss")).toBeUndefined();
    expect(() => getByLabel(scene, "boss")).toThrow();
  });
});
```

## Testing createAsyncDelay

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, createTestContext } from "pixi-solid/testing";
import { createAsyncDelay } from "pixi-solid/utils";
import type { AsyncDelayFunction } from "pixi-solid/utils";

describe("createAsyncDelay", () => {
  it("resolves after the requested time passes on the ticker", async () => {
    const ctx = createTestContext();
    let delay!: AsyncDelayFunction;

    mountTest(() => {
      delay = createAsyncDelay();
    });

    const controller = new AbortController();
    const promise = delay(500, controller.signal);

    // Advance half the time — still pending
    ctx.ticker.fastForwardTime(250);
    await Promise.resolve();

    // Advance remaining time — resolves
    ctx.ticker.fastForwardTime(250);
    await promise;
  });

  it("rejects when aborted", async () => {
    const ctx = createTestContext();
    let delay!: AsyncDelayFunction;

    mountTest(() => {
      delay = createAsyncDelay();
    });

    const controller = new AbortController();
    const promise = delay(1000, controller.signal);
    controller.abort();

    await expect(promise).rejects.toBeDefined();
  });
});
```

## Cleanup pattern

Wire `dispose()` into your test framework's lifecycle to avoid memory leaks:

```tsx
import { afterEach } from "vitest";
import { mountTest } from "pixi-solid/testing";

const disposers: (() => void)[] = [];

afterEach(() => {
  for (const dispose of disposers) dispose();
  disposers.length = 0;
});

it("some test", () => {
  const { dispose } = mountTest(() => <ctx.Provider>...</ctx.Provider>);
  disposers.push(dispose);
});
```

## jsdom / renderer caveats

- jsdom does not provide WebGL contexts. Tests that rely on WebGL-only renderer features should either mock Pixi renderer behavior or run in an environment that supports WebGL.
- For most logic that depends on ticks (animations, timers, callbacks), the testing utilities in `pixi-solid/testing` don't need a real canvas at all.

## Practical tips

- Keep tests deterministic: avoid `ticker.start()` — use `fastForwardFrames()` or `fastForwardTime()` for precise control.
- Use refs for typed access to rendered Pixi instances — this avoids the `JSX.Element` type erasure problem.
- Use `getByLabel` over `.children[index]` to decouple tests from scene graph layout.
- When testing components that create resources imperatively, advance frames and then dispose to exercise cleanup paths.
- All mocks (`ticker`, `renderer`, `app`) are plain objects — spy with `vi.spyOn`, `jest.fn()`, or any framework.
