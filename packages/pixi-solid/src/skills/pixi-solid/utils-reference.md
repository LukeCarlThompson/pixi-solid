---
name: utils-reference
description: Reference for all publicly exported utility functions, hooks, and components from pixi-solid/utils. Use when working with delays, animations, or object fitting.
---

# Utils reference

This reference covers the public `pixi-solid/utils` API. Ticker-bound helpers need the provider context described below. They are not standalone PixiJS or SolidJS utilities.

## Import

```ts
import {
  createDelay,
  createAsyncDelay,
  ObjectFitContainer,
  objectFit,
  useSmoothDamp,
  useSpring,
} from "pixi-solid/utils";
```

## Types

```ts
import type {
  ObjectFitMode,
  ObjectPosition,
  ObjectFitContainerProps,
  Spring,
  UseSpringProps,
  DelayFunction,
  AsyncDelayFunction,
} from "pixi-solid/utils";
import type { PixiComponentProps } from "pixi-solid";
import type * as Pixi from "pixi.js";
import type { JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";
```

## Delay utilities

### `createDelay()`

Creates a callback-based delay function bound to the current ticker.

```ts
type DelayFunction = (delayMs: number, callback: () => void) => void;
type createDelay = () => DelayFunction;
```

Call `createDelay` synchronously inside a descendant of `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`. The returned function captures that ticker. Call it later from an event handler, a ticker callback, an async continuation, or a nested delay callback.

**Parameters (returned function):**

- `delayMs` — Number of milliseconds to wait (measured in the ticker's time units).
- `callback` — A callback function that fires when `delayMs` has passed.

**Note:** Does not run if the ticker is paused or stopped. Scheduled callbacks have no cancellation handle and stay registered until their delay elapses.

**Example:**

```tsx
import { Text } from "pixi-solid";
import { createDelay } from "pixi-solid/utils";

const DelayedCallbackComponent = () => {
  const delay = createDelay();

  const handleClick = () => {
    delay(1000, () => {
      console.log("One second later, ticker-synced");

      delay(500, () => {
        console.log("Nested delay complete");
      });
    });
  };

  return <Text text="Click me" eventMode="static" onpointerdown={handleClick} />;
};
```

### `createAsyncDelay()`

Creates a delay function that waits until a given number of milliseconds has passed on the current Ticker context before resolving.

```ts
type AsyncDelayFunction = (delayMs: number, signal?: AbortSignal) => Promise<void>;
type createAsyncDelay = () => AsyncDelayFunction;
```

**Returns:** An async function that you can `await` to delay work in sync with the ticker.

**Constraints:** Create it synchronously inside a component under `PixiApplicationProvider`, `PixiCanvas`, or `TickerProvider`. The returned function can be called later from an event handler or async function.

**Parameters (returned function):**

- `delayMs` — Number of milliseconds to wait.
- `signal` — Optional `AbortSignal` to resolve the delay early.

**Note:** Does not resolve while the ticker is paused or stopped, unless the `AbortSignal` aborts.

**Example:**

```tsx
import { onCleanup } from "solid-js";
import { Text } from "pixi-solid";
import { createAsyncDelay } from "pixi-solid/utils";

const DelayedAsyncComponent = () => {
  const delay = createAsyncDelay();
  const controller = new AbortController();
  onCleanup(() => controller.abort());

  const handleClick = async () => {
    await delay(500, controller.signal);
    if (controller.signal.aborted) return;
    console.log("Resumed after 500ms, ticker-synced");
  };

  return <Text text="Click me" eventMode="static" onpointerdown={handleClick} />;
};
```

## Object fitting

### `objectFit(object, bounds, fitMode, position?)`

Scale an object to fit within the given bounds according to the specified fit mode. Sets the `scale` and `position` properties of the object.

```ts
type objectFit = (
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
  position?: ObjectPosition,
) => void;
```

**Parameters:**

- `object` — The `Pixi.Container` to scale.
- `bounds` — The bounds (width, height) to fit within.
- `fitMode` — The fit mode to apply.
- `position` — Optional object position anchor. Defaults to `"center"`.

**`ObjectFitMode`:** `"cover" | "contain" | "fill" | "scale-down" | "none"`

| Mode           | Behavior                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `"cover"`      | Scale to fill the bounds. Content can overflow, and this helper does not clip it. Uses `Math.max(widthRatio, heightRatio)`. |
| `"contain"`    | Scale to fit inside the bounds, and may leave empty space. Uses `Math.min(widthRatio, heightRatio)`.                        |
| `"fill"`       | Stretch to fill the bounds, and may distort the aspect ratio.                                                               |
| `"scale-down"` | Contain without scaling above `1`. Never enlarges the object.                                                               |
| `"none"`       | Set scale to `1`. The existing scale is replaced.                                                                           |

**`ObjectPosition`:** `"center" | "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | { x: number; y: number }`. Custom `x`/`y` values are alignment fractions: `0` start, `0.5` center, `1` end.

**Example:**

```tsx
import { Container } from "pixi.js";
import { objectFit } from "pixi-solid/utils";

const container = new Container();
objectFit(container, { width: 800, height: 600 }, "contain", "top-left");
```

### `ObjectFitContainer`

A reactive component that accepts children and fits them into a fixed area using `fitMode`, `objectPosition`, and optional `observeBounds`.

```tsx
import { PixiCanvas, Sprite } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import { Texture } from "pixi.js";

<PixiCanvas style={{ width: "800px", height: "600px" }}>
  <ObjectFitContainer width={800} height={600} fitMode="contain" objectPosition="top-left">
    <Sprite texture={Texture.WHITE} />
  </ObjectFitContainer>
</PixiCanvas>;
```

**`ObjectFitContainerProps`:**

```ts
type ObjectFitContainerProps = PixiComponentProps & {
  width: number;
  height: number;
  children: JSX.Element;
  fitMode: ObjectFitMode;
  objectPosition?: ObjectPosition;
  observeBounds?: boolean;
};
```

Props accepted:

- `width`, `height` — The bounding area dimensions.
- `fitMode` — How children are scaled (see `ObjectFitMode` above).
- `objectPosition` — How children are positioned within the bounds (see `ObjectPosition` above).
- `observeBounds` — If `true`, checks each child's local bounds every tick and re-fits only when the bounds change. This adds per-frame work, so use it only when child bounds change dynamically. Requires ticker context.
- Standard pixi-solid `Container` props (position, scale, mask, events, etc.) on the outer container.

**Behavior:**

- The component wraps each child in a container and applies object-fit scaling from `width`, `height`, `fitMode`, and `objectPosition`.
- If you pass multiple children, the component wraps, scales, and positions each one independently.
- To apply the same object-fit behavior to multiple children as a group, wrap them in a parent `Container` and pass that single container as the child to `ObjectFitContainer`.

## Animation utilities

### `useSpring(props)`

A SolidJS hook that provides a spring-animated signal towards a target value. It manages spring physics and continuous updates, synced to the Pixi ticker.

```ts
type UseSpringProps = {
  to: () => number;
  stiffness?: () => number; // default: 10
  damping?: () => number; // default: 30
  mass?: () => number; // default: 20
};

type Spring = {
  value: Accessor<number>;
  setValue: (value: number) => void;
  velocity: Accessor<number>;
};

type useSpring = (props: UseSpringProps) => Spring;
```

**Parameters (`UseSpringProps`):**

- `to` — Accessor for the target value.
- `stiffness` — Tuning range 0–100. Controls resistance to displacement. Default: 10.
- `damping` — Tuning range 0–100. Controls friction/resistance. Default: 30.
- `mass` — Tuning range 0–100. Controls inertia. Default: 20. Values are not clamped.

**Returns (`Spring`):**

- `value` — The current spring-animated value (reactive accessor).
- `velocity` — The current velocity (reactive accessor).
- `setValue` — Sets the value directly (teleport) without resetting velocity. The next frame continues physics toward the target.

**Example:** Use under a ticker-providing component such as `PixiCanvas`.

```tsx
import { Sprite } from "pixi-solid";
import { Texture } from "pixi.js";
import { useSpring } from "pixi-solid/utils";
import { createSignal } from "solid-js";

function SpringSprite() {
  const [target, setTarget] = createSignal(100);
  const spring = useSpring({ to: target });

  return (
    <Sprite
      texture={Texture.WHITE}
      scale={50}
      x={spring.value()}
      eventMode="static"
      onpointertap={() => setTarget((value) => value + 50)}
    />
  );
}
```

### `useSmoothDamp(props)`

A SolidJS hook that provides a smoothly damped signal towards a target value. It is similar to Unity's `Mathf.SmoothDamp`.

```ts
type UseSmoothDampProps = {
  to: () => number;
  smoothTimeMs?: () => number; // default: 300
  maxSpeed?: () => number; // default: Infinity
};

type SmoothDamp = {
  value: Accessor<number>;
  velocity: Accessor<number>;
  setValue: (value: number) => void;
};

type useSmoothDamp = (props: UseSmoothDampProps) => SmoothDamp;
```

`UseSmoothDampProps` and `SmoothDamp` are not exported from `pixi-solid/utils`. TypeScript infers them from `useSmoothDamp`.

**Parameters (`UseSmoothDampProps`):**

- `to` — Accessor for the target value.
- `smoothTimeMs` — Approximate time to approach the target in milliseconds. A smaller value is faster. Default: 300.
- `maxSpeed` — Maximum speed in units per second. Default: `Infinity`.

**Returns (`SmoothDamp`):**

- `value` — The current damped value (reactive accessor).
- `velocity` — The current velocity (reactive accessor).
- `setValue` — Sets the value directly (teleport) without resetting velocity. The next frame continues damping toward the target.

**Example:** Use under a ticker-providing component such as `PixiCanvas`.

```tsx
import { Sprite } from "pixi-solid";
import { Texture } from "pixi.js";
import { useSmoothDamp } from "pixi-solid/utils";
import { createSignal } from "solid-js";

function SmoothSprite() {
  const [target, setTarget] = createSignal(100);
  const damp = useSmoothDamp({ to: target, smoothTimeMs: 500 });

  return (
    <Sprite
      texture={Texture.WHITE}
      scale={50}
      x={damp.value()}
      eventMode="static"
      onpointertap={() => setTarget((value) => value + 50)}
    />
  );
}
```

## `useSpring` vs `useSmoothDamp`

| Feature    | `useSpring`                               | `useSmoothDamp`                                          |
| ---------- | ----------------------------------------- | -------------------------------------------------------- |
| Behavior   | Spring motion that can oscillate          | Smooth damped motion, typically without oscillation      |
| Parameters | `stiffness`, `damping`, `mass`            | `smoothTimeMs`, `maxSpeed`                               |
| Returns    | `value`, `velocity`, `setValue`           | `value`, `velocity`, `setValue`                          |
| Use when   | You want spring motion that can overshoot | You want smooth motion that typically does not oscillate |

## Lifecycle considerations

- Ticker-bound utilities require `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider`, and pause when the ticker stops.
- `createDelay` has no cancellation handle. Use `createAsyncDelay` with an `AbortSignal` when owner cleanup must cancel a pending delay. Aborting resolves the promise, so check `signal.aborted` after `await`.
- `useSpring` can overshoot. `useSmoothDamp` typically does not oscillate.
- `ObjectFitContainer` needs ticker context only when `observeBounds` is enabled. That option checks bounds every tick.
