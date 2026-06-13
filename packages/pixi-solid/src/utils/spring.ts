import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";

import { onTick } from "../on-tick";

/**
 * @typedef {Object} UseSpringProps
 * @property {Accessor<number>} to - An accessor for the target value for the spring.
 * @property {Accessor<number>} [stiffness=10] - Effective range from 0 - 100. Controls the spring's resistance to displacement.
 * @property {Accessor<number>} [damping=30] - Effective range from 0 - 100. Controls the amount of friction or resistance to motion.
 * @property {Accessor<number>} [mass=20] - Effective range from 0 - 100. Controls the inertia of the spring.
 */
export type UseSpringProps = {
  to: () => number;
  stiffness?: () => number;
  damping?: () => number;
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
 * Internally manages the spring physics and continuous updates synced to the Pixi ticker.
 *
 * @param {UseSpringProps} props - The properties for the spring animation.
 * @returns {Spring} An object containing the current spring-animated value, velocity, and a setter for the value.
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
