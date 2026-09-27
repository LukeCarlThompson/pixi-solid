---
name: pixi-solid
description: Use when building scenes and components with pixi-solid. Covers the full public API, JSX components, hooks, utilities, providers, and testing patterns.
metadata:
  triggers: "pixi-solid, pixi-solid component, SolidJS Pixi, pixi-solid review, solid pixi, pixi solid"
---

# Pixi-solid guidelines

Use this skill for `pixi-solid` APIs and integration only. Prefer its components, providers, hooks, and utilities for scene integration; import PixiJS classes from `pixi.js` and Solid primitives from `solid-js`.

## Overview

`pixi-solid` wraps PixiJS display objects in SolidJS components and adds context, lifecycle, and utility APIs. It does not re-export PixiJS or SolidJS APIs. The package supports `pixi.js >=8.14.3 <9`, `solid-js >=2.0.0-rc.9 <3`, and `@solidjs/web >=2.0.0-rc.9 <3`. Three providers exist:

- **`PixiCanvas`** — mounts the application canvas and resizes it to its wrapper.
- **`PixiApplicationProvider`** — provides app context without mounting a canvas; use when HTML outside the canvas needs hooks, or when passing an `existingApp`.
- **`TickerProvider`** — context wrapper around an existing `Pixi.Ticker`; use for testing or subtrees that need an independent ticker.

## Getting started

Minimal setup — a canvas with a sprite:

```tsx
import { PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";

function App() {
  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
      <Sprite texture={Texture.WHITE} x={100} y={100} scale={50} tint="#ff0000" />
    </PixiCanvas>
  );
}
```

Reactive position using a signal:

```tsx
import { createSignal } from "solid-js";
import { PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";

function App() {
  const [x, setX] = createSignal(100);

  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }}>
      <Sprite
        texture={Texture.WHITE}
        scale={50}
        positionX={x()}
        eventMode="static"
        onpointertap={() => setX((current) => current + 10)}
      />
    </PixiCanvas>
  );
}
```

> **Note:** Both `x`/`y` and `positionX`/`positionY` are equivalent and work for static and reactive values. Axis props (`positionX`, `positionY`, `scaleX`, etc.) enable fine-grained reactivity — only the changed axis triggers an update instead of the whole point object.

For details, see [application-context.md](./application-context.md), [asset-loading.md](./asset-loading.md), [component-types.md](./component-types.md), [hooks-lifecycle.md](./hooks-lifecycle.md), [testing.md](./testing.md), and [utils-reference.md](./utils-reference.md).

## Public API checklist

Exports from `pixi-solid` and its public subpaths:

| Area                        | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                   | Reference                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Providers                   | `PixiCanvas`, `PixiApplicationProvider`, `TickerProvider`                                                                                                                                                                                                                                                                                                                                                                                 | [application-context.md](./application-context.md)                                                                                         |
| Hooks and lifecycle         | `getPixiApp`, `getRenderer`, `getTicker`, `onResize`, `onTick`, `usePixiScreen`                                                                                                                                                                                                                                                                                                                                                           | [hooks-lifecycle.md](./hooks-lifecycle.md)                                                                                                 |
| Components                  | `AnimatedSprite`, `BitmapText`, `Container`, `Graphics`, `HTMLText`, `MeshPlane`, `MeshRope`, `NineSliceSprite`, `ParticleContainer`, `PerspectiveMesh`, `RenderContainer`, `RenderLayer`, `Sprite`, `SplitBitmapText`, `SplitText`, `Text`, `TilingSprite`                                                                                                                                                                               | [component-types.md](./component-types.md)                                                                                                 |
| Root types                  | `AnimatedSpriteProps`, `BitmapTextProps`, `ContainerProps`, `GraphicsProps`, `HTMLTextProps`, `MeshPlaneProps`, `MeshRopeProps`, `NineSliceSpriteProps`, `ParticleContainerProps`, `PerspectiveMeshProps`, `PixiApplicationProps`, `PixiCanvasProps`, `PixiComponentProps`, `PixiScreenDimensions`, `RenderContainerProps`, `RenderLayerProps`, `SpriteProps`, `SplitBitmapTextProps`, `SplitTextProps`, `TextProps`, `TilingSpriteProps` | [application-context.md](./application-context.md), [component-types.md](./component-types.md), [hooks-lifecycle.md](./hooks-lifecycle.md) |
| `pixi-solid/utils` values   | `createAsyncDelay`, `createDelay`, `objectFit`, `ObjectFitContainer`, `useSmoothDamp`, `useSpring`                                                                                                                                                                                                                                                                                                                                        | [utils-reference.md](./utils-reference.md)                                                                                                 |
| `pixi-solid/utils` types    | `AsyncDelayFunction`, `DelayFunction`, `ObjectFitContainerProps`, `ObjectFitMode`, `ObjectPosition`, `Spring`, `UseSpringProps`                                                                                                                                                                                                                                                                                                           | [utils-reference.md](./utils-reference.md)                                                                                                 |
| `pixi-solid/testing` values | `cleanup`, `createManualTicker`, `createTestContext`, `getAllByLabel`, `getByLabel`, `mountScene`, `queryByLabel`, `renderHook`                                                                                                                                                                                                                                                                                                           | [testing.md](./testing.md)                                                                                                                 |
| `pixi-solid/testing` types  | `ManualTicker`, `MountSceneOptions`, `MountSceneResult`, `RenderHookOptions`, `RenderHookResult`, `TestContext`, `TestRenderer`                                                                                                                                                                                                                                                                                                           | [testing.md](./testing.md)                                                                                                                 |

## Quick rules

- Use axis props (`positionX`, `positionY`, `scaleX`, etc.) for fine-grained reactivity instead of replacing whole point objects.
- `Container`, `RenderContainer`, and `RenderLayer` accept children; child components attach automatically. Leaf components do not accept children.
- `as` uses a caller-owned Pixi instance. `pixi-solid` does not destroy that instance on unmount.
- Pixi options initialize the instance; changed values update writable instance properties. Constructor-only options may not update after mount.
- `AnimatedSprite` uses the current ticker by default; set `autoUpdate={false}` to manage updates yourself.
- Pixi events use lowercase `on*` props (`onpointerdown`), not DOM `on:` listeners. Pointer interaction needs `eventMode="static"` or `"dynamic"`.
- `onResize` fires a callback; `usePixiScreen` returns reactive screen dimensions. Use the store when dimensions are needed as values.
- Context-dependent APIs must run under their required provider. See [hooks-lifecycle.md](./hooks-lifecycle.md#provider-requirements).
