---
name: hooks-lifecycle
description: Reference for all publicly exported hooks (onTick, onResize, usePixiScreen, getPixiApp, getTicker, getRenderer) from pixi-solid. Use when reacting to ticks, resizing, or accessing the application.
---

# Hooks and lifecycle

This subskill covers every publicly exported hook from `pixi-solid`. Use it when reacting to ticks, responding to resize events, or accessing the application, renderer, or ticker.

## Import

```ts
import {
  getPixiApp,
  getTicker,
  getRenderer,
  onResize,
  onTick,
  usePixiScreen,
} from "pixi-solid";
```

## Hooks

### `getPixiApp`

Returns the root `PIXI.Application` instance created by `PixiApplicationProvider` or `PixiCanvas`.

```ts
type getPixiApp = () => Pixi.Application;
```

**Returns:** `Pixi.Application`

**Constraints:** Must be called from a component that is a descendant of `PixiApplicationProvider` or `PixiCanvas`.

**Use when:** You need to interact directly with the Pixi.js application (e.g. access the stage, modify application-level settings, or access the renderer).

**Throws:** `"getPixiApp must be used within a PixiApplicationProvider or a PixiCanvas"` if no context is available.

### `getRenderer`

Returns the `PIXI.Renderer` instance created by `PixiApplicationProvider` or `PixiCanvas`.

```ts
type getRenderer = () => Pixi.Renderer;
```

**Returns:** `Pixi.Renderer`

**Constraints:** Must be called from a component that is a descendant of `PixiApplicationProvider` or `PixiCanvas`.

**Use when:** You need to interact directly with the Pixi.js renderer (e.g. for WebGL context access, renderer plugin registration, or rendering to a specific target).

**Throws:** `"getRenderer must be used within a PixiApplicationProvider or a PixiCanvas"` if no context is available.

### `getTicker`

Returns the `PIXI.Ticker` instance from the nearest context provider.

```ts
type getTicker = () => Pixi.Ticker;
```

**Returns:** `Pixi.Ticker`

**Constraints:** Must be called from a component that is a descendant of `PixiApplicationProvider`, `PixiCanvas`, or `TickerProvider`.

**Use when:** You need direct access to the ticker (e.g. to add custom callbacks, adjust ticker settings, or integrate with external systems).

**Throws:** `"getTicker must be used within a PixiApplicationProvider, PixiCanvas, or TickerProvider"` if no context is available.

### `onResize`

Registers a callback to be called whenever the Pixi.js renderer is resized. The callback is automatically removed when the component is unmounted.

```ts
type onResize = (resizeCallback: (screen: Pixi.Rectangle) => void) => void;
```

**Parameters:**
- `resizeCallback` — A callback that receives `(screen: Pixi.Rectangle) => void`, giving you `.width`, `.height`, `.x`, and `.y`. The callback is called immediately upon hook initialization and then on every subsequent resize event.

**Constraints:** Must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.

**Use when:** You need to react to the canvas being resized (e.g. to update layout, reposition elements, or recalculate dimensions).

**Note:** Listens for the renderer's "resize" event, so this works correctly whether the window is resized or just the DOM element the `PixiCanvas` is inside of changes size.

**Throws:** `"onResize must be used within a PixiApplicationProvider or a PixiCanvas"` if no context is available.

### `onTick`

Registers a callback to be called on each tick of the Pixi.js ticker. The callback is automatically removed when the component is unmounted.

```ts
type onTick = (
  tickerCallback: Pixi.TickerCallback<Pixi.Ticker>,
  priority?: Pixi.UPDATE_PRIORITY,
) => void;
```

**Parameters:**
- `tickerCallback` — The function to call on each ticker update. Receives the `Pixi.Ticker` instance as its argument.
- `priority` — Optional priority level (`Pixi.UPDATE_PRIORITY`). Controls callback ordering. Defaults to `UPDATE_PRIORITY.NORMAL`.

**Constraints:** Must be called from a component that is a descendant of `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`.

**Use when:** You need to update objects every frame (e.g. animations, physics, game logic).

**Note:** Callbacks are ordered by priority (lower priority runs first). Use `UPDATE_PRIORITY.LOW`, `UPDATE_PRIORITY.NORMAL`, or `UPDATE_PRIORITY.HIGH`.

**Throws:** `"onTick must be used within a PixiApplicationProvider, PixiCanvas or a TickerProvider"` if no context is available.

### `usePixiScreen`

Returns a reactive SolidJS store with the current screen dimensions of the Pixi application. The properties update automatically when the screen size changes.

```ts
type usePixiScreen = () => Readonly<PixiScreenDimensions>;
```

**Returns:** `Readonly<PixiScreenDimensions>` — A reactive store with these properties:

```ts
type PixiScreenDimensions = {
  width: number;
  height: number;
  left: number;    // getter: this.x
  right: number;   // getter: this.x + this.width
  bottom: number;  // getter: this.y + this.height
  top: number;     // getter: this.y
  x: number;
  y: number;
};
```

**Constraints:** Must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.

**Use when:** You need reactive screen dimensions as a SolidJS store — to subscribe to, pass as component props, or create derived signals from. Prefer this over `onResize` when you need the dimensions as a reactive value rather than just reacting to changes.

**Throws:** `"usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas"` if no context is available.

### Testing

For unit tests pixi-solid provides testing utilities that avoid the need for a live canvas. Use `createTestContext()` for a mock provider and `createManualTicker()` for deterministic frame control.

```tsx
import { describe, expect, it } from "vitest";
import { mountTest, createTestContext } from "pixi-solid/testing";
import { onTick } from "pixi-solid";

describe("onTick", () => {
  it("fires each frame", () => {
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

See [testing.md](./testing.md) for the full guide.

## Provider requirements

| Hook | Required context |
|---|---|
| `getPixiApp` | `PixiCanvas` or `PixiApplicationProvider` |
| `getRenderer` | `PixiCanvas` or `PixiApplicationProvider` |
| `getTicker` | `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` |
| `onResize` | `PixiCanvas` or `PixiApplicationProvider` |
| `onTick` | `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` |
| `usePixiScreen` | `PixiCanvas` or `PixiApplicationProvider` |

## `onResize` vs `usePixiScreen`

- **`onResize`** — Use when you just need to react to resize events. The callback fires on every resize. No reactive store.
- **`usePixiScreen`** — Use when you need the current screen dimensions as a reactive SolidJS store. The returned store updates automatically and can be subscribed to or passed as component props.

Both hooks are triggered by the renderer's "resize" event. They can be used together — `onResize` schedules its callback via `queueMicrotask` to ensure `usePixiScreen` listeners have synchronized their reactive values first.
