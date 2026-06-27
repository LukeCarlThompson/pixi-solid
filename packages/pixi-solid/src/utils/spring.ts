import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { onTick } from "../on-tick";

export type UseSpringProps = {
  /** The target value to spring towards. */
  to: () => number;
  /** Spring stiffness (0–100, effective range). Controls resistance to displacement. Defaults to 10. */
  stiffness?: () => number;
  /** Spring damping (0–100, effective range). Controls friction / resistance to motion. Defaults to 30. */
  damping?: () => number;
  /** Spring mass (0–100, effective range). Controls inertia. Defaults to 20. */
  mass?: () => number;
};

export type Spring = {
  value: Accessor<number>;
  /**
   * Sets the current value of the spring directly. This can be used to "teleport" the spring to a specific value.
   * The next frame will still calculate the spring physics as normal based on the current to value so you may want to set the to value at the same time to control the behaviour.
   */
  setValue: (value: number) => void;
  velocity: Accessor<number>;
};

/**
 * A SolidJS hook that provides a spring-animated signal towards a target value.
 * Internally manages spring physics with continuous updates synced to the Pixi ticker.
 *
 * @example
 * ```tsx
 * const spring = useSpring({ to: () => targetX() });
 *
 * return <Sprite x={spring.value()} />;
 * ```
 */
export const useSpring = (props: UseSpringProps): Spring => {
  const [value, setValue] = createSignal(props.to());
  const [velocity, setVelocity] = createSignal(0);

  const update = (deltaTimeMS: number) => {
    const targetInput = props.to();
    const currentValue = value();
    const currentVelocity = velocity();

    if (targetInput === currentValue) return;

    // Settling condition: if output is very close to input and velocity is negligible,
    // snap to input and stop calculations.
    if (Math.abs(currentVelocity) < 0.1 && Math.abs(currentValue - targetInput) < 0.01) {
      setVelocity(0);
      setValue(targetInput);
      return;
    }

    const deltaTime = deltaTimeMS / 1000; // Convert milliseconds to seconds

    // Get current spring properties, using defaults if not provided
    const stiffness = percentToValueBetweenRange(props.stiffness?.() ?? 10, -1, -300);
    const damping = percentToValueBetweenRange(props.damping?.() ?? 30, -0.4, -20);
    const mass = percentToValueBetweenRange(props.mass?.() ?? 20, 0.1, 10);

    const springX = stiffness * (currentValue - targetInput);
    const damperX = damping * currentVelocity;
    const amplitude = (springX + damperX) / mass;

    setVelocity((prev) => prev + amplitude * deltaTime);
    setValue(currentValue + currentVelocity * deltaTime);
  };

  onTick((ticker) => {
    update(ticker.deltaMS);
  });

  return { value, velocity, setValue };
};

// Helper to convert 0-100 percent range to internal calculation range
const percentToValueBetweenRange = (percent: number, min: number, max: number) =>
  (percent * (max - min)) / 100 + min;
