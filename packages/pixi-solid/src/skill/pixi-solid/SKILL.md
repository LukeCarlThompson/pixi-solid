---
name: pixi-solid
description: Use when building scenes and components with pixi-solid. Covers the full public API: JSX components, hooks, utilities, providers, and testing patterns.
metadata:
  triggers: "pixi-solid, pixi-solid component, SolidJS Pixi, pixi-solid review, solid pixi, pixi solid"
---

# Pixi-solid guidelines

You are an expert pixi-solid AI assistant. You write highly performant, type-safe code tailored to Solid's compiled fine-grained reactivity system and Pixi's high performance rendering capabilities.

## Overview

`pixi-solid` is a SolidJS library that provides a set of JSX components and utilities for creating PixiJS applications. It allows developers to use SolidJS's declarative syntax to create and manage PixiJS objects, while also leveraging SolidJS's reactivity system for state management.

It works with pixi.js v8 and SolidJS v1.9.10 or later. The main root providers are `PixiCanvas`, `PixiApplicationProvider` (which can also reuse an `existingApp`), and `TickerProvider` for ticker-only contexts or testing. Three providers exist:

- **`PixiCanvas`** — simplest setup; owns the canvas and resizes to its wrapper.
- **`PixiApplicationProvider`** — provides app context; use when HTML outside the canvas needs access to hooks, or when you pass an `existingApp`.
- **`TickerProvider`** — context wrapper around an existing `Pixi.Ticker` instance; use for testing or subtrees that need an independent ticker.

## Public API checklist

This skill documents only the public API exported by the package. Quick checklist of exported symbols and where they are documented:

- Providers: PixiCanvas, PixiApplicationProvider, TickerProvider — see [application-context.md](./application-context.md)
- Hooks & lifecycle: getPixiApp, getRenderer, getTicker, onResize, onTick, usePixiScreen — see [hooks-lifecycle.md](./hooks-lifecycle.md)
- Components: AnimatedSprite, BitmapText, Container, Graphics, HTMLText, MeshPlane, MeshRope, NineSliceSprite, ParticleContainer, PerspectiveMesh, RenderContainer, RenderLayer, Sprite, Text, TilingSprite — see [component-types.md](./component-types.md)
- Utils: delay, createAsyncDelay, objectFit, ObjectFitContainer, useSpring, useSmoothDamp — see [utils-reference.md](./utils-reference.md)
- Types: PixiComponentProps, ContainerProps, LeafProps, SpriteProps, TilingSpriteProps, point-axis types, and event handler types — see [component-types.md](./component-types.md)
- Testing: mountTest, createTestContext, createManualTicker, getByLabel, queryByLabel, getAllByLabel — see [testing.md](./testing.md)

## Components

### PixiJS primitive components

Many common PixiJS display objects are available as SolidJS components in `pixi-solid`. These include:

```ts
import {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  MeshPlane,
  MeshRope,
  NineSliceSprite,
  ParticleContainer,
  PerspectiveMesh,
  RenderContainer,
  RenderLayer,
  Sprite,
  Text,
  TilingSprite,
} from "pixi-solid";
```

All of these pixi-solid components take the same props as their PixiJS counterparts, with the addition of event handlers, `ref`, and point axis shorthands. The best reference for the purpose, capabilities and options for the `pixi-solid` components is the [PixiJS docs](https://pixijs.download/release/docs/scene.html) themselves.

### Point-axis props

Point properties can be set as objects (`position={{ x: 10, y: 10 }}`) or as individual axis props for fine-grained reactivity. For the per-component axis availability table and full type definitions, see [component-types.md](./component-types.md#point-axis-types).

#### `ref` and `children`

All pixi-solid components support a `ref` callback that receives the underlying PixiJS object when mounted. Container components (e.g. `Container`, `RenderLayer`) accept `children` — nested pixi-solid components are automatically added to the parent. `Graphics` is typically used imperatively through `ref` for drawing commands.

For usage patterns, code examples, and the `as` prop for pre-existing instances, see [component-types.md](./component-types.md#component-api-patterns).

### `as` prop (advanced)

All pixi-solid components accept an optional `as` prop to use a **pre-existing PixiJS instance** instead of creating a new one. See [component-types.md](./component-types.md#as-prop-advanced) for details, examples, and lifecycle notes.

### Event handlers

All PixiJS events are available as component props with the pattern `on` + the PixiJS event name (all lowercase). For example, PixiJS's `pointerdown` becomes `onpointerdown`:

```tsx
<Sprite
  texture={Texture.WHITE}
  eventMode="static"
  onpointerdown={(e) => console.log("down", e)}
  onpointerup={(e) => console.log("up", e)}
  onpointermove={(e) => console.log("move", e)}
/>
```

**Note:** All interactive events require `eventMode="static"` or `eventMode="dynamic"` on the component to be received.

For common events by category, capture variants, and handler type signatures, see [component-types.md](./component-types.md#event-handler-types).

### AnimatedSprite

`AnimatedSprite` supports all sprite props (anchor, events, point axes) plus the standard PixiJS `AnimatedSprite` options (`textures`, `playing`, `loop`, `animationSpeed`, `autoUpdate`). For the `autoUpdate` ticker integration behavior and type definitions, see [component-types.md](./component-types.md#animatedspritepropscomponent).

```tsx
import { AnimatedSprite } from "pixi-solid";

<AnimatedSprite
  textures={spritesheet.animations.walk}
  animationSpeed={0.1}
  playing={true}
  loop={true}
/>
```

### Deliberate omissions

Certain PixiJS classes are intentionally not exported by `pixi-solid`. See [component-types.md](./component-types.md#deliberate-omissions) for the full list and rationale.

### Memory management & cleanup

For memory management guidelines, cleanup patterns, and lifecycle best practices — including handling `RenderTexture`, custom geometry, and the `existingApp` lifecycle — see [hooks-lifecycle.md](./hooks-lifecycle.md#memory-management--cleanup).

### Performance best-practices

Performance guidelines are integrated into the [Usage cheat sheet](#usage-cheat-sheet) below.

## Application and Canvas instantiation

Three providers exist — see [application-context.md](./application-context.md) for full prop types and constraints.

- **`PixiCanvas`** — the simplest setup. Renders the canvas inside a positioned wrapper `div` and auto-resizes to its bounds.
- **`PixiApplicationProvider`** — provides app context without mounting a canvas. Use when HTML outside the canvas needs access to hooks, or when passing an `existingApp`.
- **`TickerProvider`** — context wrapper around an existing `Pixi.Ticker` instance. Use for testing or independent ticker subtrees.

For hooks and lifecycle details, see [hooks-lifecycle.md](./hooks-lifecycle.md).

## Utils

All utilities are imported from `pixi-solid/utils`:

- **`delay(ms, cb)`** — callback-based ticker delay.
- **`createAsyncDelay()`** — async/await ticker delay. Create it in a tracked Pixi scope, then `await` it later; supports `AbortSignal`.
- **`ObjectFitContainer`** — reactive component that fits children into a fixed area using `fitMode`, `objectPosition`, and optional `observeBounds`.
- **`objectFit(object, bounds, fitMode, position?)`** — imperative one-shot fit helper.
- **`useSpring()` / `useSmoothDamp()`** — ticker-synced numeric motion helpers returning `{ value, velocity, setValue }`.

For complete signatures, parameters, and examples, see [utils-reference.md](./utils-reference.md).

## Usage cheat sheet

### Quick rules

- Pixi events use lowercase `on*` props (`onpointerdown`), not DOM `on:` listeners.
- Interactive events require `eventMode="static"` or `eventMode="dynamic"`.
- Use axis props (`positionX`, `positionY`, `scaleX`, etc.) for fine-grained reactivity instead of replacing whole point objects.
- Use `ref` for imperative PixiJS access (e.g. `Graphics` drawing commands).
- Child components are automatically added to parent containers.
- `onResize` fires a callback; `usePixiScreen` returns a reactive store. Use `usePixiScreen` when you need dimensions as values.
- All hooks (`onResize`, `onTick`, `usePixiScreen`) require being inside a provider context.
- Minimize the number of reactive signals driving a single Pixi object; group values when appropriate and batch imperative updates when needed.
- Use `ParticleContainer` for high-volume particle systems and update particles imperatively.

### Custom component prop forwarding

- Use `PixiComponentProps` when building your own Pixi-backed components and you want consumers to pass through Pixi-style props to the underlying instance.
- The generic form lets you target a specific Pixi options type, for example `PixiComponentProps<Pixi.SpriteOptions>` or `PixiComponentProps<Pixi.ContainerOptions>`.
- If your component only supports a subset of props, narrow the forwarded props with `Pick` or `Omit` before spreading them to the underlying Pixi component.
- Combine `PixiComponentProps`, `splitProps`, and `{...rest}` spreading to separate custom props from Pixi props cleanly.
- Use `Pick` when you want to allow only specific Pixi props, and `Omit` when you want to exclude props you handle yourself or that do not make sense on your component.

### Asset loading patterns

- Use Solid's `createResource` for loading assets before rendering dependent Pixi content.
- For a single asset, load it directly and render with `<Show when={...}>` once ready.
- For larger apps, prefer Pixi asset manifests and bundle loading with `Assets.loadBundle()`.
- Use manifests to group scene-specific or UI-specific assets and keep loading logic organized.
- Gate dependent Pixi UI until the resource resolves, and access loaded assets from Pixi's asset cache where appropriate.
- Keep asset-loading code outside of render-heavy Pixi components when possible so scene content stays focused on display logic.

### Utils, hooks, and testing

- See [utils-reference.md](./utils-reference.md) for delays, object fitting, and animation utilities.
- See [hooks-lifecycle.md](./hooks-lifecycle.md) for hook signatures, constraints, and provider requirements.
- See [testing.md](./testing.md) for `mountTest`, `createTestContext`, `createManualTicker`, and scene graph queries.
