import type * as Pixi from "pixi.js";

import { isEventProperty, setEventProperty } from "./set-event-property";
import { isPointProperty, setPointProperty } from "./set-point-property";

export const setProp = <T = unknown>(
  instance: Pixi.Container,
  key: string,
  value: T,
  prevValue?: T,
): T | undefined => {
  if (isPointProperty(key)) {
    setPointProperty(instance, key, value as number);
    return value;
  }

  if (isEventProperty(key)) {
    setEventProperty(instance, key, value, prevValue);
    return value;
  }

  (instance as any)[key] = value;
  return value;
};
