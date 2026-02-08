import type { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { onTick } from "../on-tick";

/**
 * Smoothly dampens a value towards a target over time.
 * This is similar to Unity's Mathf.SmoothDamp function.
 *
 * @param current - The current value.
 * @param target - The target value.
 * @param velocity - A reference to the current velocity. This should be persistent between calls.
 * @param smoothTimeMs - The approximate time it will take to reach the target in milliseconds. Smaller values will reach the target faster.
 * @param maxSpeed - Optionally, the maximum speed the value can move in units per second. Defaults to Infinity.
 * @param deltaTime - The time since the last call in seconds. Defaults to 1/60 (assuming 60 FPS).
 * @param precision - Optionally, the threshold for snapping the value to the target. If the absolute difference between the current and target value is less than this, it snaps to the target. Defaults to 0.01.
 * @returns The new current value.
 */
export const smoothDamp = (
  current: number,
  target: number,
  velocity: { value: number },
  smoothTimeMs: number = 300,
  maxSpeed: number = Infinity,
  deltaTime: number = 1 / 60,
  precision: number = 0.01, // Added precision parameter with a default
): number => {
  if (current === target) return current;

  // Check precision and velocity before doing calculations
  if (Math.abs(current - target) < precision && Math.abs(velocity.value) < precision) {
    velocity.value = 0; // Reset velocity
    return target; // Snap to target and return early
  }

  const smoothTime = smoothTimeMs / 1000; // Convert smoothTimeMs to seconds
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (velocity.value + omega * change) * deltaTime;
  velocity.value = (velocity.value - omega * temp) * exp;

  let result = target + (change + temp) * exp;

  // Clamp to max speed
  if (maxSpeed !== Infinity) {
    const maxChange = maxSpeed * deltaTime;
    result = current + Math.max(-maxChange, Math.min(maxChange, result - current));
  }

  return result;
};

/**
 * A SolidJS hook that provides a smoothly damped signal towards a target value.
 * Internally manages velocity and continuous updates synced to the Pixi ticker.
 *
 * @param to - An accessor for the target value to damp towards.
 * @param smoothTimeMs - The approximate time it will take to reach the target in milliseconds. Smaller values will reach the target faster. Defaults to 300ms.
 * @param maxSpeed - Optionally, the maximum speed the value can move in units per second. Defaults to Infinity.
 * @returns A signal containing the current damped value.
 */

export type UseSmoothDampProps = {
  to: () => number;
  smoothTimeMs?: () => number;
  maxSpeed?: () => number;
};

export type SmoothDamp = {
  value: Accessor<number>;
  velocity: Accessor<number>;
};

export const useSmoothDamp = (props: UseSmoothDampProps): SmoothDamp => {
  const [current, setCurrent] = createSignal(props.to());
  const velocity = createMutable({ value: 0 });

  const update = (deltaTimeMS: number) => {
    const currentValue = current();
    const currentTarget = props.to();

    if (currentValue === currentTarget) {
      velocity.value = 0;
      return;
    }

    const deltaTime = deltaTimeMS / 1000; // Convert milliseconds to seconds
    const newCurrent = smoothDamp(
      currentValue,
      currentTarget,
      velocity,
      props.smoothTimeMs?.(),
      props.maxSpeed?.(),
      deltaTime,
    );
    setCurrent(newCurrent);
  };

  onTick((ticker) => {
    update(ticker.deltaMS);
  });

  return {
    value: current,
    velocity: () => velocity.value,
  };
};
