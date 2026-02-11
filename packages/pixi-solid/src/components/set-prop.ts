import { isEventProperty, setEventProperty } from "./set-event-property";
import { isPointProperty, setPointProperty } from "./set-point-property";
import type * as Pixi from "pixi.js";

export const setProp = <T = unknown>(
  instance: Pixi.Container,
  key: string,
  value: T,
  prevValue?: T,
) => {
  if (isPointProperty(key)) {
    setPointProperty(instance, key, value as number);
    return;
  }

  if (key in instance) {
    (instance as any)[key] = value;
    return;
  }

  if (isEventProperty(key)) {
    setEventProperty(instance, key, value, prevValue);
  }
};
