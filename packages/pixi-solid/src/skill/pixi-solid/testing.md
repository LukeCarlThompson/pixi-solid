---
name: testing
description: Testing patterns for pixi-solid components and hooks using mountScene, createTestRoot, createTestContext, and createManualTicker. Covers scene graph queries, container-based typed access, and cleanup patterns.
---

# Testing pixi-solid

This subskill documents recommended patterns for unit testing code that uses `pixi-solid`.

## Quick reference

| Utility | Purpose |
|---|---|
| `mountScene(setup)` | Mount a scene graph and return `{ container, dispose }` |
| `createTestRoot(setup)` | Run Solid code in a temporary root (for hooks/stores) |
| `createTestContext()` | One-stop mock provider with ticker, renderer, and app |
| `createManualTicker()` | Stopped ticker with step-based frame advancement |
| `getByLabel(root, label)` | Find a node by label (throws if not found) |
| `queryByLabel(root, label)` | Find a node by label (returns `undefined` if not found) |
| `getAllByLabel(root, label)` | Find all nodes with the given label |

```ts
import {
  mountScene,
  createTestRoot,
  createTestContext,
  createManualTicker,
  getByLabel,
  queryByLabel,
  getAllByLabel,
} from "pixi-solid/testing";
```

## mountScene

`mountScene(setup)` mounts JSX in a temporary Solid root and returns the root Container. Use this for component tests.

```tsx
type MountSceneResult<TRoot = Pixi.Container> = {
  container: TRoot;
  dispose: () => void;
};
```

The returned `container` is the root PixiJS node — access properties directly or query children with `getByLabel`. No ref callback needed.

### Basic component test

```tsx
import { describe, expect, it } from "vitest";
import { mountScene, createTestContext } from "pixi-solid/testing";
import { Container, Sprite } from "pixi-solid";

describe("scene", () => {
  it("positions a sprite", () => {
    const { container } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" x={100} />
      </Container>
    ));

    // Container is Pixi.Container — no ref callback needed
    const player = getByLabel(container, "player");
    expect(player.x).toBe(100);
  });
});
```

### With onTick

```tsx
import { describe, expect, it } from "vitest";
import { mountScene, createTestContext } from "pixi-solid/testing";
import { onTick } from "pixi-solid";

describe("Component with onTick", () => {
  it("calls the tick callback each frame", () => {
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
});
```

### Non-Container roots (AnimatedSprite, etc.)

For component types that are not `Pixi.Container`, specify the type via the generic parameter:

```tsx
const { container } = mountScene<Pixi.AnimatedSprite>(() => (
  <AnimatedSprite textures={textures} playing />
));

container.playing;  // typed as Pixi.AnimatedSprite
```

## createTestRoot

`createTestRoot<T>(setup)` runs code in a temporary Solid root and returns the result. Use this for testing hooks and stores.

```tsx
type CreateTestRootResult<T> = {
  value: T;
  dispose: () => void;
};
```

Unlike `mountScene`, this does NOT resolve JSX — it runs the callback directly. Bring your own providers.

### Testing hooks

```tsx
import { describe, expect, it } from "vitest";
import { createTestRoot, createTestContext } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("usePixiScreen", () => {
  it("returns the screen dimensions from context", () => {
    const ctx = createTestContext();

    const { value: screen } = createTestRoot(() => (
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
import { createTestRoot } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("usePixiScreen error", () => {
  it("throws when used outside a provider", () => {
    expect(() => createTestRoot(() => usePixiScreen())).toThrow();
  });
});
```

## createTestContext

Creates mock PixiJS contexts for testing. Returns `{ Provider, ticker, renderer, app }`.

```tsx
import { createTestContext, mountScene } from "pixi-solid/testing";

const ctx = createTestContext();

mountScene(() => (
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
import { createTestRoot, createTestContext } from "pixi-solid/testing";
import { usePixiScreen } from "pixi-solid";

describe("resize handling", () => {
  it("updates on emitResize", () => {
    const ctx = createTestContext();

    const { value: screen } = createTestRoot(() => (
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
import { mountScene, getByLabel, queryByLabel } from "pixi-solid/testing";
import { Container, Sprite } from "pixi-solid";

describe("getByLabel", () => {
  it("finds a child sprite by label", () => {
    const { container } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" x={100} y={200} />
        <Sprite label="enemy" x={300} y={400} />
      </Container>
    ));

    const player = getByLabel(container, "player");
    expect(player.x).toBe(100);
  });

  it("returns undefined for missing labels with queryByLabel", () => {
    const { container } = mountScene(() => (
      <Container label="scene">
        <Sprite label="player" />
      </Container>
    ));

    expect(queryByLabel(container, "boss")).toBeUndefined();
    expect(() => getByLabel(container, "boss")).toThrow();
  });
});
```

## Testing createAsyncDelay

```tsx
import { describe, expect, it } from "vitest";
import { createTestRoot, createTestContext } from "pixi-solid/testing";
import { createAsyncDelay } from "pixi-solid/utils";

describe("createAsyncDelay", () => {
  it("resolves after the requested time passes on the ticker", async () => {
    const ctx = createTestContext();
    let delay!: (ms: number, signal?: AbortSignal) => Promise<void>;

    createTestRoot(() => {
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
    let delay!: (ms: number, signal?: AbortSignal) => Promise<void>;

    createTestRoot(() => {
      delay = createAsyncDelay();
    });

    const controller = new AbortController();
    const promise = delay(1000, controller.signal);
    controller.abort();

    await expect(promise).rejects.toBeDefined();
  });
});
```

## Cleanup

All disposers are registered with a global registry. Wire `cleanup()` into your test framework's lifecycle:

```tsx
import { afterEach } from "vitest";
import { cleanup } from "pixi-solid/testing";

afterEach(() => cleanup());
```

Once wired, you no longer need to track `dispose`:

```tsx
it("some test", () => {
  mountScene(() => <Container label="root" />);
  // cleanup runs automatically in afterEach
});
```

To disable automatic cleanup for a specific test, pass your own dispose:

```tsx
it("manual cleanup", () => {
  const { dispose } = mountScene(() => <Container />);
  // ... test logic ...
  dispose(); // manual cleanup, cleanup() won't double-dispose
});
```

## jsdom / renderer caveats

- jsdom does not provide WebGL contexts. Tests that rely on WebGL-only renderer features should either mock Pixi renderer behavior or run in an environment that supports WebGL.
- For most logic that depends on ticks (animations, timers, callbacks), the testing utilities in `pixi-solid/testing` don't need a real canvas at all.

## Practical tips

- Keep tests deterministic: avoid `ticker.start()` — use `fastForwardFrames()` or `fastForwardTime()` for precise control.
- Use `mountScene` for component tests — it returns the root Container directly, no ref callbacks needed.
- Use `createTestRoot` for hook and store tests — it returns the raw value.
- Use `getByLabel` over `.children[index]` to decouple tests from scene graph layout.
- When testing components that create resources imperatively, advance frames and then dispose to exercise cleanup paths.
- All mocks (`ticker`, `renderer`, `app`) are plain objects — spy with `vi.spyOn`, `jest.fn()`, or any framework.
