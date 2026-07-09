---
name: pixi-solid
description: Use when building scenes and components with pixi-solid. Covers the full public API, JSX components, hooks, utilities, providers, and testing patterns.
metadata:
  triggers: "pixi-solid, pixi-solid component, SolidJS Pixi, pixi-solid review, solid pixi, pixi solid"
---

# Pixi-solid guidelines

You are an expert pixi-solid AI assistant. You write highly performant, type-safe code tailored to Solid's compiled fine-grained reactivity system and Pixi's high performance rendering capabilities.

## Overview

`pixi-solid` is a SolidJS library that provides a set of JSX components and utilities for creating PixiJS applications. It allows developers to use SolidJS's declarative syntax to create and manage PixiJS objects, while also leveraging SolidJS's reactivity system of stores and signals for state management.

It works with pixi.js v8 and SolidJS v1.9.10 or later. Three providers exist:

- **`PixiCanvas`** — simplest setup; owns the canvas and resizes to its wrapper.
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
    <PixiCanvas>
      <Sprite texture={Texture.WHITE} positionX={x()} />
    </PixiCanvas>
  );
}
```

> **Note:** Both `x`/`y` and `positionX`/`positionY` are equivalent and work for static and reactive values. Axis props (`positionX`, `positionY`, `scaleX`, etc.) enable fine-grained reactivity — only the changed axis triggers an update instead of the whole point object.

For full provider options see [application-context.md](./application-context.md). For component props and types see [component-types.md](./component-types.md). For hooks and lifecycle see [hooks-lifecycle.md](./hooks-lifecycle.md).

## Public API checklist

Quick reference for all exported symbols and where they are documented:

| Area                  | Exports                                                                                                                                                                                                                     | Docs                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Providers**         | `PixiCanvas`, `PixiApplicationProvider`, `TickerProvider`                                                                                                                                                                   | [application-context.md](./application-context.md) |
| **Hooks & lifecycle** | `getPixiApp`, `getRenderer`, `getTicker`, `onResize`, `onTick`, `usePixiScreen`                                                                                                                                             | [hooks-lifecycle.md](./hooks-lifecycle.md)         |
| **Components**        | `AnimatedSprite`, `BitmapText`, `Container`, `Graphics`, `HTMLText`, `MeshPlane`, `MeshRope`, `NineSliceSprite`, `ParticleContainer`, `PerspectiveMesh`, `RenderContainer`, `RenderLayer`, `Sprite`, `Text`, `TilingSprite` | [component-types.md](./component-types.md)         |
| **Prop types**        | `PixiComponentProps`, `ContainerProps`, `LeafProps`, `SpriteProps`, `AnimatedSpriteProps`, `TilingSpriteProps`, point-axis types, event handler types                                                                       | [component-types.md](./component-types.md)         |
| **Utils**             | `delay`, `createAsyncDelay`, `ObjectFitContainer`, `objectFit`, `useSpring`, `useSmoothDamp`                                                                                                                                | [utils-reference.md](./utils-reference.md)         |
| **Testing**           | `mountScene`, `createTestRoot`, `createTestContext`, `createManualTicker`, `getByLabel`, `queryByLabel`, `getAllByLabel`, `cleanup`                                                                                         | [testing.md](./testing.md)                         |

## Quick rules

- Pixi events use lowercase `on*` props (`onpointerdown`), not DOM `on:` listeners.
- Interactive events require `eventMode="static"` or `eventMode="dynamic"`.
- Use axis props (`positionX`, `positionY`, `scaleX`, etc.) for fine-grained reactivity instead of replacing whole point objects.
- Child components are automatically added to parent containers.
- `onResize` fires a callback; `usePixiScreen` returns a reactive store. Use `usePixiScreen` when you need dimensions as values.
- All hooks require being inside the appropriate provider context — see [hooks-lifecycle.md](./hooks-lifecycle.md#provider-requirements) for the table.
