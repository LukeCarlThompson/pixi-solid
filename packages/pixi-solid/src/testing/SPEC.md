# Testing Utilities — Spec

## Goals

- Enable testing of pixi-solid components and hooks without a live canvas
- Remain **framework-agnostic** — no coupling to vitest, jest, or any test runner
- Provide sensible defaults so simple tests need minimal setup
- Allow full override so users can inject spied/stubbed instances

## Design

### Three concerns, three files

```
manual-ticker.ts    →  Frame-accurate ticker control
test-context.tsx    →  One-stop mock context provider
test-root.tsx       →  Solid root lifecycle management
```

Each file owns one concern and can be used independently.

### `test-root.tsx` — Solid root lifecycle

- `mountScene(setup)` — mounts JSX and returns the root Container
- `createTestRoot(setup)` — runs Solid code in a temporary root (for hooks/stores)
- Returns `{ value, dispose }` — `value` is the setup's return, `dispose` cleans up
- Uses `children()` internally so signal-driven re-renders work correctly
- Built on Solid's `createRoot`, no test framework imports

### `query-by-label.ts` — Scene graph queries

- `getByLabel(root, label)` — depth-first search by `label` property, throws if not found
- `queryByLabel(root, label)` — same but returns `undefined`
- `getAllByLabel(root, label)` — returns array of all matches
- Decouples tests from scene graph layout—find nodes by semantic label instead of `.children[index]`

### `manual-ticker.ts` — Time control

- `createManualTicker()` → `ManualTicker`
- `ticker` — the raw PixiJS `Ticker` instance (stopped by default)
- `fastForwardFrames(n, deltaTime?)` — advance N frames at a given step size
- `fastForwardTime(totalMS, stepSize?)` — advance through a duration in small steps
- Step-based advancement avoids footguns where single large deltas break spring/smooth-damp or sequenced animations

### `test-context.tsx` — Mock context provider

- `createTestContext(options?)` → `{ Provider, ticker, renderer, app }`
- `Provider` wraps children in `PixiAppContext`, `TickerContext`, and `ScreenStoreContext`
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
