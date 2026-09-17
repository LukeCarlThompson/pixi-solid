---
name: component-types
description: Reference for publicly exported component prop types from pixi-solid. Use when building custom components or forwarding props.
---

# Component prop types

This subskill covers every publicly exported type from `pixi-solid` that defines what props a component accepts. Use it when building custom components, forwarding props, or understanding what values a component accepts.

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
```

## Component prop types

### `PixiComponentProps<ComponentOptions>`

Generic base type for any Pixi-backed component. Takes a Pixi options type (e.g. `Pixi.SpriteOptions`) so consumers can pass through all valid Pixi props.

```ts
type PixiComponentProps<ComponentOptions extends Pixi.ContainerOptions = Pixi.ContainerOptions> =
  PixiSolidEventHandlerMap & CommonPointAxisProps & Omit<ComponentOptions, "children">;
```

Use this when building your own Pixi-backed component and you want consumers to pass through Pixi-style props to the underlying instance. If you don't require all props, narrow with `Pick` or `Omit`.

**Example:** `PixiComponentProps<Pixi.SpriteOptions>` or `PixiComponentProps<Pixi.ContainerOptions>`.

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

`AnimatedSpriteProps` includes `autoUpdate`. Container prop types include `children`. Leaf prop types do not.

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

SolidJS tracks changes by reference. Passing `position={{ x: 100, y: 200 }}` allocates a new object on every update, which both triggers the entire point to rebind and creates GC pressure. Axis props like `positionX` and `positionY` are plain `number` values — no allocations, and only the changed axis triggers an update.

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

All events also have **capture variants** with a `capture` suffix — e.g. `onpointerdowncapture`. These fire during the capture phase before the target phase. The full event list is available in PixiJS's `FederatedEventEmitterTypes`.

## Using these types

When building a custom component:

1. Import `PixiComponentProps<Pixi.YourOptionsType>` as the base.
2. Narrow with `Pick` for specific props, or `Omit` to exclude props you handle yourself.
3. Combine with `splitProps` and `{...rest}` spreading to separate custom props from Pixi props.

```tsx
import type { PixiComponentProps } from "pixi-solid";
import type * as Pixi from "pixi.js";

type MyComponentProps = PixiComponentProps<Pixi.SpriteOptions> & {
  label: string;
};
```

Example — forwarding Pixi props while handling custom props with `splitProps`:

```tsx
import { splitProps } from "solid-js";
import type { PixiComponentProps } from "pixi-solid";
import type * as Pixi from "pixi.js";

function MySprite(props: PixiComponentProps<Pixi.SpriteOptions> & { label: string }) {
  const [local, pixiProps] = splitProps(props, ["label"]);

  return <Sprite {...pixiProps}>{/* custom UI or children that use local.label */}</Sprite>;
}
```

## Component API patterns

### `ref` usage

All pixi-solid components support a `ref` callback that receives the underlying PixiJS object when mounted:

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
import { Container as PixiContainer } from "pixi.js";

const existingContainer = new PixiContainer();
existingContainer.label = "my-container";

<Container as={existingContainer}>
  <Sprite texture={Texture.WHITE} />
</Container>;
```

**Lifecycle note:** When `as` is provided, pixi-solid assumes you own the instance's lifecycle and will **not** destroy it on unmount. You must destroy it manually when no longer needed.

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

`Particle` is omitted because `ParticleContainer` is designed for high-volume, imperative particle updates rather than fine-grained Solid reactivity. Use `ParticleContainer` from `pixi-solid` and manage particle instances imperatively.

The other omitted classes are low-level geometry classes used when building custom meshes. Create them imperatively with PixiJS and wrap in a custom `pixi-solid` component when needed.
