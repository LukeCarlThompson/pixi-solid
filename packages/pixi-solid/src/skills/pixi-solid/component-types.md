---
name: component-types
description: Reference for publicly exported component prop types from pixi-solid. Use when building custom components or forwarding props.
---

# Component prop types

This reference covers public component prop types and the behavior that affects how pixi-solid components are written. Use PixiJS docs for underlying class options not specific to pixi-solid.

## Import

```ts
import type {
  PixiComponentProps,
  AnimatedSpriteProps,
  BitmapTextProps,
  ContainerProps,
  GraphicsProps,
  HTMLTextProps,
  MeshPlaneProps,
  MeshRopeProps,
  NineSliceSpriteProps,
  ParticleContainerProps,
  PerspectiveMeshProps,
  RenderContainerProps,
  RenderLayerProps,
  SpriteProps,
  SplitBitmapTextProps,
  SplitTextProps,
  TextProps,
  TilingSpriteProps,
} from "pixi-solid";
import type * as Pixi from "pixi.js";
import type { JSX } from "@solidjs/web";
import type { Ref } from "solid-js";
```

## Component prop types

### `PixiComponentProps<ComponentOptions>`

Generic base type for a Pixi-backed component. It combines Pixi options with typed event props and common point-axis props. It also adds `anchorX`/`anchorY` when the options include `anchor`, and `tilePositionX`/`tilePositionY` plus `tileScaleX`/`tileScaleY` when options include `tilePosition`.

Use this when building your own Pixi-backed component and you want consumers to pass through Pixi-style props to the underlying instance. If you don't require all props, narrow with `Pick` or `Omit`.

**Examples:** `PixiComponentProps<Pixi.SpriteOptions>` or `PixiComponentProps<Pixi.ContainerOptions>`. The first includes anchor axes; the second does not.

Each component has a concrete prop type. These types match component signatures and include Pixi options, Solid props, event props, and axis props.

Concrete prop types combine the matching PixiJS options with Solid lifecycle props:

```ts
type SpriteProps = PixiComponentProps<Pixi.SpriteOptions> & {
  ref?: Ref<Pixi.Sprite>;
  as?: Pixi.Sprite;
};

type ContainerProps = PixiComponentProps<Pixi.ContainerOptions> & {
  ref?: Ref<Pixi.Container>;
  as?: Pixi.Container;
  children?: JSX.Element;
};
```

Available concrete prop types:

- `AnimatedSpriteProps`
- `BitmapTextProps`
- `ContainerProps`
- `GraphicsProps`
- `HTMLTextProps`
- `MeshPlaneProps`
- `MeshRopeProps`
- `NineSliceSpriteProps`
- `ParticleContainerProps`
- `PerspectiveMeshProps`
- `RenderContainerProps`
- `RenderLayerProps`
- `SpriteProps`
- `SplitBitmapTextProps`
- `SplitTextProps`
- `TextProps`
- `TilingSpriteProps`

`AnimatedSpriteProps` includes `autoUpdate`. `Container`, `RenderContainer`, and `RenderLayer` accept `children`; other component prop types do not.

## Prop updates

Pixi options are passed to the Pixi constructor when the component mounts. pixi-solid tracks changed props and updates the corresponding instance property when that property exists and is writable. Constructor-only options cannot be updated after mount. Prefer axis props when updating one coordinate or scale axis.

`AnimatedSprite` is an exception: pixi-solid disables Pixi's automatic ticker update and registers updates with the current ticker unless `autoUpdate={false}`. It therefore needs ticker context by default.

## Point-axis reference table

The table below shows which axis props are available on each component:

| Component                                                                                                   | Point-axis props                                                                                 |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Container`, `RenderContainer`, `RenderLayer`                                                               | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`                                                 |
| `Graphics`, `MeshPlane`, `MeshRope`, `ParticleContainer`, `PerspectiveMesh`, `SplitText`, `SplitBitmapText` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`                                                 |
| `Sprite`, `Text`, `BitmapText`, `HTMLText`, `NineSliceSprite`                                               | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y`                                    |
| `AnimatedSprite`                                                                                            | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y`                                    |
| `TilingSprite`                                                                                              | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y`, `tilePositionX/Y`, `tileScaleX/Y` |

### Why axis props?

When a reactive update rebuilds `position={{ x, y }}`, pixi-solid rebinds the point as a whole. Axis props such as `positionX` and `positionY` update only the changed coordinate and avoid creating a point object.

## Event props

All concrete component prop types include typed PixiJS event props. Use lowercase names such as `onpointerdown` and `onmousemove`.

Supported events include pointer, mouse, touch, wheel, tap, global movement, and capture variants such as `onpointerdowncapture`.

Interactive events require `eventMode="static"` or `eventMode="dynamic"` on the component to be received.

### Common events by category

| Category | Props                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------- |
| Pointer  | `onpointerdown`, `onpointerup`, `onpointermove`, `onpointerenter`, `onpointerleave`, `onpointertap` |
| Mouse    | `onmousedown`, `onmouseup`, `onmousemove`, `onmouseenter`, `onmouseleave`                           |
| Touch    | `ontouchstart`, `ontouchend`, `ontouchmove`, `ontouchcancel`                                        |
| Wheel    | `onwheel`                                                                                           |

Most non-global events also have **capture variants** with a `capture` suffix — e.g. `onpointerdowncapture`. They fire during capture before the target phase. Global movement events have no capture variants. Event names are typed from PixiJS's `FederatedEventEmitterTypes`.

## Using these types

When building a custom component:

1. Import `PixiComponentProps<Pixi.YourOptionsType>` as the base.
2. Narrow with `Pick` for specific props, or `Omit` to exclude props you handle yourself.
3. Combine with `omit` and `{...rest}` spreading to separate custom props from Pixi props.

```tsx
import type { PixiComponentProps } from "pixi-solid";
import type * as Pixi from "pixi.js";

type MyComponentProps = PixiComponentProps<Pixi.SpriteOptions> & {
  label: string;
};
```

Example — forwarding Pixi props while handling custom props with `omit`. Solid 2 removed `splitProps`; `omit` returns a reactive view of the remaining props:

```tsx
import { omit } from "solid-js";
import { Container, Sprite } from "pixi-solid";
import type { PixiComponentProps } from "pixi-solid";
import type * as Pixi from "pixi.js";

function MySprite(props: PixiComponentProps<Pixi.SpriteOptions> & { label: string }) {
  const pixiProps = omit(props, "label");

  return (
    <Container label={props.label}>
      <Sprite {...pixiProps} />
    </Container>
  );
}
```

## Component API patterns

### `ref` usage

All pixi-solid components accept a `ref` (a callback, or an array of callbacks) that receives the underlying PixiJS object when mounted:

```tsx
<Container
  ref={(container) => {
    // do something with the container instance
  }}
/>
```

`Graphics` is typically used imperatively through `ref` for drawing commands:

```tsx
<Graphics
  ref={(graphics) => {
    graphics.rect(50, 50, 100, 200).fill(0xff0000).circle(200, 200, 50).stroke(0x00ff00);
  }}
/>
```

### `as` prop (advanced)

All pixi-solid components accept an optional `as` prop to use a **pre-existing PixiJS instance** instead of creating a new one. This is useful for sharing a single instance across parts of the tree, providing pre-configured instances, or injecting mock instances in tests.

```tsx
import { Container, Sprite } from "pixi-solid";
import { Container as PixiContainer, Texture } from "pixi.js";

const existingContainer = new PixiContainer();
existingContainer.label = "my-container";

<Container as={existingContainer}>
  <Sprite texture={Texture.WHITE} />
</Container>;
```

**Lifecycle note:** When `as` is provided, pixi-solid assumes you own the instance's lifecycle and will **not** destroy it on unmount. You must destroy it manually when no longer needed. Child components still follow their own lifecycle.

## Deliberate omissions

The following PixiJS classes are intentionally not exported by `pixi-solid`:

```ts
import {
  Particle,
  MeshGeometry,
  NineSliceGeometry,
  PerspectivePlaneGeometry,
  PlaneGeometry,
  RopeGeometry,
  Rectangle,
  Culler,
} from "pixi.js";
```

`Particle` is omitted because `ParticleContainer` is designed for high-volume, imperative updates rather than per-particle Solid reactivity. Use `ParticleContainer` from `pixi-solid`, then manage `Particle` instances from `pixi.js` imperatively.

`MeshGeometry`, `NineSliceGeometry`, `PerspectivePlaneGeometry`, `PlaneGeometry`, and `RopeGeometry` are low-level geometry types for custom meshes. `Rectangle` and `Culler` are PixiJS utilities. Import these directly from `pixi.js` when needed; `pixi-solid` does not re-export PixiJS classes.
