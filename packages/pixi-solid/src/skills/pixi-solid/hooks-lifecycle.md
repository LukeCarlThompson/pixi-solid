---
name: hooks-lifecycle
description: Reference for all publicly exported hooks (onTick, onResize, usePixiScreen, getPixiApp, getTicker, getRenderer) from pixi-solid. Use when reacting to ticks, resizing, or accessing the application.
---

# Hooks and lifecycle

This reference covers `pixi-solid` context hooks and lifecycle callbacks. Call these hooks synchronously from a Solid component or owned computation under the required provider; do not call them later from an event handler or async continuation.

## Import

```ts
import { getPixiApp, getTicker, getRenderer, onResize, onTick, usePixiScreen } from "pixi-solid";
import type { PixiScreenDimensions } from "pixi-solid";
import type * as Pixi from "pixi.js";
```

## Hooks

### `getPixiApp`

Returns the app instance supplied by the nearest `PixiApplicationProvider` or `PixiCanvas`, including `existingApp` when provided.

```ts
type getPixiApp = () => Pixi.Application;
```

**Returns:** `Pixi.Application`

**Constraints:** Must be called from a component that is a descendant of `PixiApplicationProvider` or `PixiCanvas`.

**Use when:** You need to interact directly with the Pixi.js application (e.g. access the stage, modify application-level settings, or access the renderer).

**Throws:** `"getPixiApp must be used within a PixiApplicationProvider or a PixiCanvas"` if no context is available.

### `getRenderer`

Returns the renderer from the app supplied by `PixiApplicationProvider` or `PixiCanvas`.

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
  left: number; // getter: this.x
  right: number; // getter: this.x + this.width
  bottom: number; // getter: this.y + this.height
  top: number; // getter: this.y
  x: number;
  y: number;
};
```

**Constraints:** Must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.

**Use when:** You need reactive screen dimensions as a SolidJS store — to subscribe to, pass as component props, or create derived signals from. Prefer this over `onResize` when you need the dimensions as a reactive value rather than just reacting to changes.

**Throws:** `"usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas"` if no context is available.

## Lifecycle ownership

pixi-solid destroys instances it creates when their Solid owner is disposed. If you pass an instance through `as`, pixi-solid does not destroy it; you own its lifecycle. `RenderLayer` does not destroy its children because those children are managed elsewhere in the scene tree.

`PixiApplicationProvider` destroys an app it creates. If you pass `existingApp`, you own that app's lifecycle. Shared textures and assets are not owned by a Sprite component; load and unload them through PixiJS `Assets` when appropriate. See [asset-loading.md](./asset-loading.md).

### Testing

See [testing.md](./testing.md) for patterns and examples of testing pixi-solid components and hooks.

## Provider requirements

| Hook            | Required context                                             |
| --------------- | ------------------------------------------------------------ |
| `getPixiApp`    | `PixiCanvas` or `PixiApplicationProvider`                    |
| `getRenderer`   | `PixiCanvas` or `PixiApplicationProvider`                    |
| `getTicker`     | `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` |
| `onResize`      | `PixiCanvas` or `PixiApplicationProvider`                    |
| `onTick`        | `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` |
| `usePixiScreen` | `PixiCanvas` or `PixiApplicationProvider`                    |

## `onResize` vs `usePixiScreen`

- **`onResize`** — Use when you just need to react to resize events. The callback fires on every resize. No reactive store.
- **`usePixiScreen`** — Use when you need the current screen dimensions as a reactive SolidJS store. The returned store updates automatically and can be subscribed to or passed as component props.

Both hooks are triggered by the renderer's "resize" event. They can be used together — `onResize` schedules its callback via `queueMicrotask` to ensure `usePixiScreen` listeners have synchronized their reactive values first.
