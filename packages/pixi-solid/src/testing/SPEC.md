# Testing Utilities — Spec

## Goals

- Enable testing of pixi-solid components and hooks without a live canvas
- Remain **framework-agnostic** — no coupling to vitest, jest, or any test runner
- Provide sensible defaults so simple tests need minimal setup
- Allow full override so users can inject spied/stubbed instances

## Design

### Three concerns, four files

```
manual-ticker.ts    →  Frame-accurate ticker control
test-context.tsx    →  One-stop mock context provider + ctx.renderHook
test-root.tsx       →  Solid root lifecycle management (mountScene, renderHook)
query-by-label.ts   →  Scene graph queries
```

Each file owns one concern and can be used independently.

### `test-root.tsx` — Solid root lifecycle

- `mountScene(setup)` — mounts JSX and returns the root Container
- `renderHook(callback, options?)` — runs a hook/store in a temporary root, optionally inside a `wrapper` component (e.g. `ctx.Provider`), and returns `{ result, dispose }`
- `result` is a reactive `Accessor<T>` — re-evaluates the callback when tracked values change; returns stable reactive objects unchanged
- `renderHook` evaluates eagerly, so errors (e.g. missing context) surface at call time
- Built on Solid's `createRoot`, no test framework imports

### `query-by-label.ts` — Scene graph queries

- `getByLabel(root, label)` — depth-first search by `label` property, throws if not found
- `queryByLabel(root, label)` — same but returns `undefined`
- `getAllByLabel(root, label)` — returns array of all matches
- Decouples tests from scene graph layout—find nodes by semantic label instead of `.children[index]`

### `manual-ticker.ts` — Time control

- `createManualTicker()` → `ManualTicker`
- `ticker` — the raw PixiJS `Ticker` instance (stopped by default)
- Seeds `ticker.lastTime = 0` so the first frame produces exactly the requested delta
- Owns a monotonic absolute clock — successive `fastForward*` calls are additive and never drop a frame
- `fastForwardFrames(n, deltaTime?)` — advance N frames at a given step size (async)
- `fastForwardTime(totalMS, stepSize?)` — advance through a duration in small steps (async)
- Both drivers are `async` and flush microtasks after every tick, so promise-based continuations (awaited `delay`, animation `onEnded` chains) receive subsequent ticks without manual `await Promise.resolve()` in tests
- Step-based advancement avoids footguns where single large deltas break spring/smooth-damp or sequenced animations

### `test-context.tsx` — Mock context provider

- `createTestContext(options?)` → `{ Provider, ticker, renderer, app, renderHook }`
- `Provider` wraps children in `PixiAppContext`, `TickerContext`, and `ScreenStoreContext`
- `renderHook` — convenience method equivalent to `renderHook(callback, { wrapper: Provider })`
- `renderer` — mock with `emit()` and `emitResize()` for simulating resize events
- `ticker` — a `ManualTicker` for advancing frames
- `app` — minimal `Pixi.Application` stub
- All mocks are plain objects — spy on them with any framework (`vi.spyOn`, `jest.fn()`, etc.)

### Override pattern

```ts
// Defaults
const ctx = createTestContext();

// With custom ticker (e.g. to spy on ticker.add)
const manual = createManualTicker();
vi.spyOn(manual.ticker, "add");
const ctx = createTestContext({ ticker: manual });
```

## Non-goals

- **Not a full PixiJS simulation** — the mocks only cover what pixi-solid hooks use
- **Not coupled to any test runner** — users integrate cleanup (`dispose()`) with their own framework hooks
- **Not a replacement for integration tests** — pixel-level or rendering tests still need a real canvas
