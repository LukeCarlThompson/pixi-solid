---
name: application-context
description: Reference for all publicly exported providers (PixiCanvas, PixiApplicationProvider, TickerProvider) from pixi-solid. Use when setting up a Pixi application context.
---

# Application context (providers)

This subskill covers every publicly exported provider from `pixi-solid`. Use it when setting up a Pixi application, choosing how to provide context, or accessing application state from outside the canvas.

## Import

```ts
import {
  PixiCanvas,
  PixiApplicationProvider,
  TickerProvider,
} from "pixi-solid";
import type {
  PixiCanvasProps,
  PixiApplicationProps,
} from "pixi-solid";
```

## Providers overview

Three providers exist. Choose based on your application's needs:

| Provider | Creates canvas? | Creates app? | Provides ticker? | Use when... |
|---|---|---|---|---|
| `PixiCanvas` | Yes | Yes (if no context) | Yes | Simplest setup; canvas owned directly by component tree |
| `PixiApplicationProvider` | No | Yes (if no context) | Yes | HTML outside canvas needs hooks, or you pass `existingApp` |
| `TickerProvider` | No | No | Yes | You have an existing ticker; testing or independent ticker |

## `PixiCanvas`

The simplest way to get started. Mounts the Pixi canvas inside a positioned wrapper `div`, accepts standard DOM props on that wrapper, and automatically resizes to the wrapper's bounds.

```tsx
import { PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";

export const DemoApp = () => (
  <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
    <Sprite texture={Texture.WHITE} x={100} y={100} scale={50} tint="#ff0000" />
  </PixiCanvas>
);
```

### `PixiCanvasProps`

```ts
type PixiCanvasProps = {
  children: JSX.Element;
  ref?: (el: HTMLDivElement) => void;
} & OmitColonEvents<Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">>
  & Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;
```

Props accepted:
- `children` — JSX content to render inside the canvas (pixi-solid components).
- DOM props — Any standard HTML `div` attributes (`style`, `class`, `id`, `aria-*`, `data-*`, etc.) are passed to the wrapper element.
- Pixi `ApplicationOptions` — Any option except `children` and `resizeTo` (handled internally).

`PixiCanvas` works with or without a surrounding `PixiApplicationProvider`:
- If used inside `PixiApplicationProvider`, it uses the provided context.
- If used standalone, it creates its own `Pixi.Application` and provides context.

## `PixiApplicationProvider`

Creates a `Pixi.Application` instance and provides it through context. Does **not** mount a canvas itself — use `PixiCanvas` as a child to render the canvas.

```tsx
import { PixiApplicationProvider, PixiCanvas, usePixiScreen, Text } from "pixi-solid";

export const DemoApp = () => (
  <PixiApplicationProvider background="#1099bb">
    <HtmlComponent />
    <PixiCanvas style={{ width: "100%", height: "500px" }}>
      <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} />
    </PixiCanvas>
  </PixiApplicationProvider>
);
```

### `PixiApplicationProps`

```ts
type PixiApplicationProps = Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">> & {
  children?: JSX.Element;
  existingApp?: Pixi.Application;
};
```

Props accepted:
- Standard `ApplicationOptions` (except `children` and `resizeTo`).
- `existingApp` — An already-created `Pixi.Application` instance. When provided, the provider reuses it instead of creating a new one. The application must be initialized before rendering, and you handle lifecycle/cleanup yourself.

`PixiApplicationProvider` also provides context for:
- `getPixiApp` — returns the `PIXI.Application` instance.
- `getTicker` — returns the `PIXI.Ticker` instance.
- `usePixiScreen` — returns reactive screen dimensions.
- `onTick` — registers callbacks on each ticker update.
- `onResize` — registers callbacks on resize.

Use `PixiApplicationProvider` when:
- HTML outside the canvas needs access to pixi-solid hooks or application state.
- You want to provide an existing Pixi application with `existingApp`.

## `TickerProvider`

Wraps an existing `Pixi.Ticker` instance in context. Does **not** create an application or canvas — it only provides ticker context.

```tsx
import { TickerProvider, onTick } from "pixi-solid";
import * as Pixi from "pixi.js";

const myTicker = new Pixi.Ticker();

export const TestApp = ({ children }) => (
  <TickerProvider ticker={myTicker}>
    {children}
  </TickerProvider>
);
```

### `TickerProviderProps`

```ts
type TickerProviderProps = ParentProps<{ ticker: Pixi.Ticker }>;
```

Props accepted:
- `ticker` — An existing `Pixi.Ticker` instance. This is the only required prop.

Use `TickerProvider` when:
- You already have a `Pixi.Ticker` instance to pass as the `ticker` prop.
- You need ticker context for testing (e.g. controlled ticker with manual advancement).
- You need a subtree that runs on its own independent ticker.

See [testing](./testing.md) for recommended TickerProvider test patterns and examples.

`TickerProvider` provides context for:
- `getTicker` — returns the provided ticker.
- `onTick` — registers callbacks on each ticker update.
- `delay` and `createAsyncDelay` — ticker-synced delays.

## Choosing the right provider

- **`PixiCanvas`** — default for most apps. Simplest setup; canvas owned directly by the component tree.
- **`PixiApplicationProvider`** — flexible choice for shared app context. Use when HTML outside the canvas needs hooks, or when passing `existingApp`.
- **`TickerProvider`** — only when you have an existing ticker. Testing or independent ticker subtrees.

## Constraints

- `onResize` must be called from a descendant of `PixiCanvas` or `PixiApplicationProvider`.
- `onTick`, `delay`, and `createAsyncDelay` must be called from a descendant of `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`.
- `usePixiScreen` must be called from a descendant of `PixiCanvas` or `PixiApplicationProvider`.
- `getPixiApp` and `getRenderer` must be called from a descendant of `PixiCanvas` or `PixiApplicationProvider`.
- `getTicker` must be called from a descendant of `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`.
