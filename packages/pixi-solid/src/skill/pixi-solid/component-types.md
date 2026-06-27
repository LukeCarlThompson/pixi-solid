---
name: component-types
description: Reference for all publicly exported prop types, point axis types, and event handler types from pixi-solid. Use when building custom components or forwarding props.
---

# Component prop types

This subskill covers every publicly exported type from `pixi-solid` that defines what props a component accepts. Use it when building custom components, forwarding props, or understanding what values a component accepts.

## Import

```ts
import type {
  PixiComponentProps,
  ContainerProps,
  LeafProps,
  SpriteProps,
  AnimatedSpriteProps,
  TilingSpriteProps,
  CommonPointAxisProps,
  AnchorPointAxisProps,
  TilingPointAxisProps,
  PointAxisPropName,
  CommonPointAxisPropName,
  AnchorPointAxisPropName,
  TilingPointAxisPropName,
  PixiSolidEventHandlerName,
  PixiSolidEventHandlerMap,
} from "pixi-solid";
```

## Component prop types

### `PixiComponentProps<ComponentOptions>`

Generic base type for any Pixi-backed component. Takes a Pixi options type (e.g. `Pixi.SpriteOptions`) so consumers can pass through all valid Pixi props.

```ts
type PixiComponentProps<ComponentOptions extends Pixi.ContainerOptions = Pixi.ContainerOptions>
  = PixiSolidEventHandlerMap
  & CommonPointAxisProps
  & Omit<ComponentOptions, "children">;
```

Use this when building your own Pixi-backed component and you want consumers to pass through Pixi-style props to the underlying instance. If you don't require all props, narrow with `Pick` or `Omit`.

**Example:** `PixiComponentProps<Pixi.SpriteOptions>` or `PixiComponentProps<Pixi.ContainerOptions>`.

### `ContainerProps<Component>`

Props for container components (those that accept children).

```ts
type ContainerProps<Component>
  = PixiSolidEventHandlerMap
  & CommonPointAxisProps
  & { ref?: Ref<Component>; as?: Component }
  & { children?: JSX.Element };
```

Used by: `Container`, `RenderContainer`, `RenderLayer`.

### `LeafProps<Component>`

Props for leaf components (those that do not accept children).

```ts
type LeafProps<Component>
  = PixiSolidEventHandlerMap
  & CommonPointAxisProps
  & { ref?: Ref<Component>; as?: Component };
```

Used by: `Graphics`, `ParticleContainer`.

Example — `ParticleContainer` usage:

```tsx
import * as PIXI from "pixi.js";
import { onMount, onCleanup } from "solid-js";

function ParticleExample() {
  let pc: PIXI.ParticleContainer | undefined;

  onMount(() => {
    const s = new PIXI.Sprite(myTexture);
    s.x = Math.random() * 800;
    pc!.addChild(s);

    onCleanup(() => {
      pc!.removeChild(s);
      s.destroy();
    });
  });

  return <ParticleContainer ref={(el) => (pc = el)} />;
}
```

### `SpriteProps<Component>`

Props for sprite-like components (includes anchor properties).

```ts
type SpriteProps<Component>
  = PixiSolidEventHandlerMap
  & CommonPointAxisProps
  & AnchorPointAxisProps
  & { ref?: Ref<Component>; as?: Component };
```

Used by: `Sprite`, `BitmapText`, `HTMLText`, `MeshPlane`, `MeshRope`, `NineSliceSprite`, `PerspectiveMesh`, `Text`.

### `AnimatedSpriteProps<Component>`

Props for `AnimatedSprite`, extends `SpriteProps` with an additional `autoUpdate` boolean.

```ts
type AnimatedSpriteProps<Component>
  = SpriteProps<Component>
  & Pick<Pixi.AnimatedSpriteOptions, "autoUpdate">;
```

**`autoUpdate` behavior:** PixiJS's default `AnimatedSprite` auto-updates via the global shared ticker. pixi-solid overrides this: when `autoUpdate` is omitted or `true`, the component sets `autoUpdate = false` on the instance and manages ticker registration itself against the nearest ticker context. When `autoUpdate={false}`, no ticker registration occurs — you control timing manually.

### `TilingSpriteProps<Component>`

Props for `TilingSprite` (includes anchor and tiling properties).

```ts
type TilingSpriteProps<Component>
  = PixiSolidEventHandlerMap
  & CommonPointAxisProps
  & AnchorPointAxisProps
  & TilingPointAxisProps
  & { ref?: Ref<Component>; as?: Component };
```

Used by: `TilingSprite`.

## Point-axis reference table

The table below shows which axis props are available on each component:

| Component | Point-axis props |
|---|---|
| `Container`, `RenderContainer`, `RenderLayer` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y` |
| `Graphics`, `ParticleContainer` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y` |
| `Sprite`, `Text`, `BitmapText`, `HTMLText`, `NineSliceSprite`, `MeshPlane`, `MeshRope`, `PerspectiveMesh` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y` |
| `AnimatedSprite` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y` |
| `TilingSprite` | `positionX/Y`, `scaleX/Y`, `pivotX/Y`, `skewX/Y`, `anchorX/Y`, `tilePositionX/Y`, `tileScaleX/Y` |

## Point axis types

### `CommonPointAxisPropName`

Valid axis prop names for `position`, `scale`, `pivot`, and `skew`:

```ts
type CommonPointAxisPropName = "positionX" | "positionY" | "scaleX" | "scaleY" | "pivotX" | "pivotY" | "skewX" | "skewY";
```

### `CommonPointAxisProps`

Shorthand props for common point properties:

```ts
type CommonPointAxisProps = Partial<Record<CommonPointAxisPropName, number>>;
```

### `AnchorPointAxisPropName`

Valid axis prop names for `anchor`:

```ts
type AnchorPointAxisPropName = "anchorX" | "anchorY";
```

### `AnchorPointAxisProps`

Shorthand props for anchor:

```ts
type AnchorPointAxisProps = Partial<Record<AnchorPointAxisPropName, number>>;
```

### `TilingPointAxisPropName`

Valid axis prop names for `tilePosition` and `tileScale`:

```ts
type TilingPointAxisPropName = "tilePositionX" | "tilePositionY" | "tileScaleX" | "tileScaleY";
```

### `TilingPointAxisProps`

Shorthand props for tiling-specific properties:

```ts
type TilingPointAxisProps = Partial<Record<TilingPointAxisPropName, number>>;
```

### `PointAxisPropName`

All axis properties (union of all categories):

```ts
type PointAxisPropName
  = CommonPointAxisPropName
  | AnchorPointAxisPropName
  | TilingPointAxisPropName;
```

## Event handler types

### `PixiSolidEventHandlerName`

Maps every supported event name to its corresponding prop name string. Events are all lowercase with `on` prefix: `onpointerdown`, `onmousemove`, `ontouchstart`, etc.

```ts
type PixiSolidEventHandlerName = `on${keyof FederatedEventEmitterTypes}`;
```

Supported events include all pointer, mouse, touch, wheel, and tap events, plus **capture variants** (e.g. `onpointerdowncapture` — fires during the capture phase before the target phase). Every event from PixiJS's `FederatedEventEmitterTypes` is covered.

### `PixiSolidEventHandlerMap`

Maps event names to their handler signatures:

```ts
type PixiSolidEventHandlerMap = {
  [K in (typeof PIXI_EVENT_NAMES)[number] as `on${K}`]?:
    | null
    | ((...args: FederatedEventEmitterTypes[K]) => void);
};
```

**Note:** Interactive events require `eventMode="static"` or `eventMode="dynamic"` on the component to be received.

### Common events by category

| Category | Props |
|---|---|
| Pointer | `onpointerdown`, `onpointerup`, `onpointermove`, `onpointerenter`, `onpointerleave`, `onpointertap` |
| Mouse | `onmousedown`, `onmouseup`, `onmousemove`, `onmouseenter`, `onmouseleave` |
| Touch | `ontouchstart`, `ontouchend`, `ontouchmove`, `ontouchcancel` |
| Wheel | `onwheel` |

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

  return (
    <Sprite {...pixiProps}>
      {/* custom UI or children that use local.label */}
    </Sprite>
  );
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
</Container>
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
