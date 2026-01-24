import type * as Pixi from "pixi.js";
import {
  ALL_VALID_PROP_NAMES_SET,
  POINT_PROP_AXIS_NAMES_SET,
  POINT_PROP_NAMES_SET,
} from "./point-property-names";

export const isPointProperty = (propName: string): boolean =>
  ALL_VALID_PROP_NAMES_SET.has(propName);

export const setPointProperty = <T>(node: Pixi.Container, name: string, value: T): void => {
  if (typeof value === "object" && value !== null) {
    (node as any)[name].set((value as any).x, (value as any).y);
    return;
  }

  if (typeof value === "number") {
    if (POINT_PROP_NAMES_SET.has(name)) {
      (node as any)[name].set(value);
    } else if (POINT_PROP_AXIS_NAMES_SET.has(name)) {
      const axisName = name[name.length - 1].toLowerCase();
      const propertyName = name.slice(0, -1);
      (node as any)[propertyName][axisName] = value;
    }
  }
};
