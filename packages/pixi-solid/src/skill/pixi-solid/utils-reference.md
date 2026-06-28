---
name: utils-reference
description: Reference for all publicly exported utility functions, hooks, and components from pixi-solid/utils. Use when working with delays, animations, or object fitting.
---

# Utils reference

This subskill covers every publicly exported utility from `pixi-solid/utils`. Use it for delays, animations, and object fitting.

## Import

```ts
import {
  delay,
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
  AsyncDelayFunction,
} from "pixi-solid/utils";
```

## Delay utilities

### `delay(ms, callback)`

Runs a callback when a given number of milliseconds has passed on the ticker.

```ts
type delay = (delayMs: number, callback?: () => void) => void;
```

**Parameters:**
- `delayMs` — Number of milliseconds to wait (measured in the ticker's time units).
- `callback` — A callback function that fires when `delayMs` has passed.

**Constraints:** Must be called within a `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` context.

**Note:** Does not run if the ticker is paused or stopped.

**Example:**

```tsx
import { delay } from "pixi-solid/utils";

const handleClick = () => {
  delay(1000, () => {
    console.log("One second later, ticker-synced");
  });
};
```

### `createAsyncDelay()`

Creates a delay function that waits until a given number of milliseconds has passed on the current Ticker context before resolving.

```ts
type AsyncDelayFunction = (delayMs: number, signal?: AbortSignal) => Promise<void>;
type createAsyncDelay = () => AsyncDelayFunction;
```

**Returns:** An async function we can `await` to delay events in sync with the ticker.

**Constraints:** `createAsyncDelay` must be called synchronously inside a tracked descendant of `PixiApplicationProvider`, `PixiCanvas`, or `TickerProvider`. The returned function can be called in an async context later.

**Parameters (returned function):**
- `delayMs` — Number of milliseconds to wait.
- `signal` — Optional `AbortSignal` to resolve the delay early.

**Note:** Does not resolve if the ticker is paused or stopped.

**Example:**

```tsx
import { createAsyncDelay } from "pixi-solid/utils";

const delay = createAsyncDelay();

const handleClick = async (signal?: AbortSignal) => {
  await delay(500, signal);
  console.log("Resumed after 500ms, ticker-synced");
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

| Mode | Behavior |
|---|---|
| `"cover"` | Scale to fill bounds, may crop. Uses `Math.max(widthRatio, heightRatio)`. |
| `"contain"` | Scale to fit inside bounds, may leave empty space. Uses `Math.min(widthRatio, heightRatio)`. |
| `"fill"` | Stretch to fill bounds, may distort aspect ratio. |
| `"scale-down"` | Scale to cover or contain, whichever is smaller. |
| `"none"` | No scaling applied. |

**`ObjectPosition`:** `"center" | "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | { x: number; y: number }`

**Example:**

```tsx
import { objectFit } from "pixi-solid/utils";

// Imperative one-shot fit
objectFit(container, { width: 800, height: 600 }, "contain", "top-left");
```

### `ObjectFitContainer`

A reactive component that accepts children and fits them into a fixed area using `fitMode`, `objectPosition`, and optional `observeBounds`.

```tsx
<ObjectFitContainer
  x={100}
  y={100}
  width={800}
  height={600}
  fitMode="contain"
  objectPosition="top-left"
>
  <Sprite texture={texture} />
</ObjectFitContainer>
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
- `observeBounds` — If `true`, remeasures children's local bounds every tick and re-fits. **Performance concern** — runs on every frame. Only use when children's bounds change dynamically.
- Standard pixi-solid `Container` props (position, scale, mask, events, etc.) on the outer container.

**Behavior:**
- Each child is wrapped in a container and object-fit scaling is applied based on `width`, `height`, `fitMode`, and `objectPosition`.
- If multiple children are passed, each one is wrapped, scaled, and positioned independently.
- To apply the same object-fit behavior to multiple children as a group, wrap them in a parent `Container` and pass that single container as the child to `ObjectFitContainer`.

## Animation utilities

### `useSpring(props)`

A SolidJS hook that provides a spring-animated signal towards a target value. Internally manages spring physics and continuous updates synced to the Pixi ticker.

```ts
type UseSpringProps = {
  to: () => number;
  stiffness?: () => number;  // default: 10
  damping?: () => number;    // default: 30
  mass?: () => number;       // default: 20
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
- `stiffness` — Effective range 0–100. Controls resistance to displacement. Default: 10.
- `damping` — Effective range 0–100. Controls friction/resistance. Default: 30.
- `mass` — Effective range 0–100. Controls inertia. Default: 20.

**Returns (`Spring`):**
- `value` — The current spring-animated value (reactive accessor).
- `velocity` — The current velocity (reactive accessor).
- `setValue` — Sets the value directly (teleport). The next frame still calculates physics based on the target.

**Example:**

```tsx
import { useSpring } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const [target, setTarget] = createSignal(100);
const spring = useSpring({ to: target });

<Sprite x={spring.value()} />;
```

### `useSmoothDamp(props)`

A SolidJS hook that provides a smoothly damped signal towards a target value. Similar to Unity's `Mathf.SmoothDamp`.

```ts
type UseSmoothDampProps = {
  to: () => number;
  smoothTimeMs?: () => number;  // default: 300
  maxSpeed?: () => number;      // default: Infinity
};

type SmoothDamp = {
  value: Accessor<number>;
  velocity: Accessor<number>;
  setValue: (value: number) => void;
};

type useSmoothDamp = (props: UseSmoothDampProps) => SmoothDamp;
```

**Parameters (`UseSmoothDampProps`):**
- `to` — Accessor for the target value.
- `smoothTimeMs` — Time to reach the target in milliseconds. Smaller = faster. Default: 300.
- `maxSpeed` — Maximum speed in units per second. Default: `Infinity`.

**Returns (`SmoothDamp`):**
- `value` — The current damped value (reactive accessor).
- `velocity` — The current velocity (reactive accessor).
- `setValue` — Sets the value directly (teleport). The next frame still calculates damping physics based on the target.

**Example:**

```tsx
import { useSmoothDamp } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const [target, setTarget] = createSignal(100);
const damp = useSmoothDamp({ to: target, smoothTimeMs: 500 });

<Sprite x={damp.value()} />;
```

## `useSpring` vs `useSmoothDamp`

| Feature | `useSpring` | `useSmoothDamp` |
|---|---|---|
| Behavior | Physically-based spring oscillation | Soft damped interpolation (no overshoot) |
| Parameters | `stiffness`, `damping`, `mass` | `smoothTimeMs`, `maxSpeed` |
| Returns | `value`, `velocity`, `setValue` | `value`, `velocity`, `setValue` |
| Use when | You want spring physics with overshoot | You want smooth, non-oscillating motion |

## Utility usage patterns

- **`delay`** — Use when you just need a callback after a ticker-synced wait (e.g. in event handlers or effects).
- **`createAsyncDelay`** — Use when you need to `await` a ticker-synced wait from async code. Create it synchronously inside a tracked descendant of `PixiApplicationProvider`, `PixiCanvas`, or `TickerProvider`, then reuse it later.
- **`ObjectFitContainer`** — Use when children should be laid out reactively inside a fixed region.
- **`objectFit`** — Use when you want the same behavior imperatively on a container.
- **`useSpring`** — Use when you want physically based motion with overshoot.
- **`useSmoothDamp`** — Use when you want softer damped interpolation without overshoot.
- **`observeBounds`** — Only use when the container size changes dynamically. It remeasures every tick, which runs on every frame and is a performance concern.
- Ticker-synced utilities do not advance while the ticker is paused or stopped.
- Both `delay` and `createAsyncDelay` throw if called outside of a `PixiCanvas`, `PixiApplicationProvider`, or `TickerProvider` context.
