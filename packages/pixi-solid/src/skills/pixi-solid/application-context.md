---
name: application-context
description: Reference for all publicly exported providers (PixiCanvas, PixiApplicationProvider, TickerProvider) from pixi-solid. Use when setting up a Pixi application context.
---

# Application context (providers)

This reference covers `pixi-solid` providers and the contexts they provide. Use it to choose how to create an application, mount its canvas, or supply an external ticker.

## Import

```ts
import { PixiCanvas, PixiApplicationProvider, TickerProvider } from "pixi-solid";
import type { PixiCanvasProps, PixiApplicationProps } from "pixi-solid";
```

## Providers overview

Three providers exist. Choose based on your application's needs:

| Provider                  | Creates canvas? | Creates app?        | Provides ticker? | Use when...                                                              |
| ------------------------- | --------------- | ------------------- | ---------------- | ------------------------------------------------------------------------ |
| `PixiCanvas`              | Yes             | Yes (if no context) | Yes              | Simplest setup. The component tree owns the canvas.                      |
| `PixiApplicationProvider` | No              | Yes (if no context) | Yes              | HTML outside canvas needs hooks, or you pass `existingApp`               |
| `TickerProvider`          | No              | No                  | Yes              | You have an existing ticker. Use it for testing or an independent ticker |

## `PixiCanvas`

The simplest setup. It mounts the Pixi canvas inside a positioned wrapper `div`, applies `class` and `style`, and resizes the canvas to the wrapper's bounds automatically.

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

Requires `children`. Wrapper-specific props are `class`, `style`, and `ref`, which receives the internal wrapper `div`.

- `class` accepts a `JSX.ClassValue`, which can be a string, number, array, or object. `style` accepts Solid's CSS object or a CSS string. Solid 2 folded `classList` into `class`, so pass an object (for example `class={{ active: isActive() }}`) instead of the removed `classList` prop.
- `ref` is a `Ref<HTMLDivElement>` (a callback, or an array of callbacks).
- Pixi `ApplicationOptions` configure app initialization, except `children` and `resizeTo`, which pixi-solid handles internally. They are not runtime-reactive.
- Other DOM attributes and event handlers are not forwarded. Wrap `PixiCanvas` in your own element when you need them.

`PixiCanvas` works with or without a surrounding `PixiApplicationProvider`:

- Inside `PixiApplicationProvider`, it uses the provided app and ignores the `PixiCanvas` application options.
- If used standalone, it creates its own `Pixi.Application` and provides context.

Give the wrapper non-zero dimensions with `style` or CSS, so automatic resizing has a usable size. Only one `PixiCanvas` may be mounted per application at a time. You can unmount and remount it under a persistent provider.

## `PixiApplicationProvider`

Creates a `Pixi.Application` instance and provides it through context. It does **not** mount or resize a canvas. The supported rendering setup uses `PixiCanvas` as a child. `resizeTo` is omitted from provider props, because `PixiCanvas` controls the resize target.

```tsx
import { PixiApplicationProvider, PixiCanvas, usePixiScreen, Text } from "pixi-solid";

function HtmlOverlay() {
  const screen = usePixiScreen();
  return (
    <div>
      {screen.width} × {screen.height}
    </div>
  );
}

export const DemoApp = () => (
  <PixiApplicationProvider background="#1099bb">
    <HtmlOverlay />
    <PixiCanvas style={{ width: "100%", height: "500px" }}>
      <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} />
    </PixiCanvas>
  </PixiApplicationProvider>
);
```

### `PixiApplicationProps`

```ts
import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";

type PixiApplicationProps = Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">> & {
  children?: JSX.Element;
  existingApp?: Pixi.Application;
};
```

Props accepted:

- Standard `ApplicationOptions` (except `children` and `resizeTo`). They apply only when this provider creates the app and are initialization-only.
- `existingApp` — An already-created `Pixi.Application` instance. When you provide it, the provider reuses it and ignores the other app options. The application must be initialized before rendering, and you handle its lifecycle and cleanup yourself.

If you pass options while `existingApp` or an ancestor provider supplies the app, pixi-solid warns in development, because it ignores those options.

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

Wraps an existing `Pixi.Ticker` instance in context. It does **not** create an application or canvas. It only provides ticker context.

```tsx
import { TickerProvider } from "pixi-solid";
import { Ticker } from "pixi.js";
import type { ParentProps } from "solid-js";
import type * as Pixi from "pixi.js";

const myTicker = new Ticker();

export const TestApp = (props: ParentProps) => (
  <TickerProvider ticker={myTicker}>{props.children}</TickerProvider>
);
```

### `TickerProviderProps`

```ts
type TickerProviderProps = ParentProps<{ ticker: Pixi.Ticker }>;
```

Props accepted:

- `ticker` — An existing `Pixi.Ticker` instance. This is the only required prop. The provider does not start, stop, or destroy it. The caller owns the ticker lifecycle.

Use `TickerProvider` mainly when:

- A scene graph branch needs an independently managed ticker.
- Different branches need different rates or clocks.
- You need to integrate an existing ticker owned by another system.
- A non-standard integration must populate ticker context for descendants outside the normal application provider tree.

Use `createTestContext` when tests need app, renderer, and screen contexts. For ticker-only tests, combine `TickerProvider` with `createManualTicker`.

`TickerProvider` provides context for:

- `getTicker` — returns the provided ticker.
- `onTick` — registers callbacks on each ticker update.
- `createDelay` and `createAsyncDelay` — ticker-synced delays.

## Choosing the right provider

- **`PixiCanvas`** — the default for most apps. Simplest setup. The component tree owns the canvas directly.
- **`PixiApplicationProvider`** — flexible choice for shared app context. Use when HTML outside the canvas needs hooks, or when passing `existingApp`.
- **`TickerProvider`** — overrides ticker context for descendants, mainly for independent ticker scene branches and other uncommon integrations.

## Provider requirements

See the [Provider requirements table in hooks-lifecycle.md](./hooks-lifecycle.md#provider-requirements).
