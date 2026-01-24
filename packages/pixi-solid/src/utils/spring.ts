import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { onTick } from "../pixi-application";

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
  velocity: Accessor<number>;
};

/**
 * A SolidJS hook that provides a spring-animated signal towards a target value.
 * Internally manages the spring physics and continuous updates synced to the Pixi ticker.
 *
 * @param {UseSpringProps} props - The properties for the spring animation.
 * @returns {Accessor<number>} A signal containing the current spring-animated value.
 */
export const useSpring = (props: UseSpringProps): Spring => {
  const [value, setValue] = createSignal(props.to());
  const [velocity, setVelocity] = createSignal(0);

  const update = (deltaTimeMS: number) => {
    const targetInput = props.to();

    // Settling condition: if output is very close to input and velocity is negligible,
    // snap to input and stop calculations.
    if (Math.abs(velocity()) < 0.1 && Math.abs(value() - targetInput) < 0.01) {
      setVelocity(0);
      setValue(targetInput);
      return;
    }

    const deltaTime = deltaTimeMS / 1000; // Convert milliseconds to seconds

    // Get current spring properties, using defaults if not provided
    const stiffness = percentToValueBetweenRange(props.stiffness?.() ?? 10, -1, -300);
    const damping = percentToValueBetweenRange(props.damping?.() ?? 30, -0.4, -20);
    const mass = percentToValueBetweenRange(props.mass?.() ?? 20, 0.1, 10);

    const springX = stiffness * (value() - targetInput);
    const damperX = damping * velocity();
    const amplitude = (springX + damperX) / mass;

    setVelocity((prev) => prev + amplitude * deltaTime);
    setValue(value() + velocity() * deltaTime);
  };

  onTick((ticker) => {
    update(ticker.deltaMS);
  });

  return { value, velocity };
};

// Helper to convert 0-100 percent range to internal calculation range
const percentToValueBetweenRange = (percent: number, min: number, max: number) =>
  (percent * (max - min)) / 100 + min;
