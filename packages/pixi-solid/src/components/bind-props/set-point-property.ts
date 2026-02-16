import type * as Pixi from "pixi.js";

import {
  POINT_PROP_NAMES_SET,
  POINT_PROP_AXIS_MAP,
  POINT_PROP_AXIS_NAMES_SET,
} from "./point-property-names";
import type { PointAxisPropName, PointPropName } from "./point-property-names";

export const isPointProperty = (propName: string): propName is PointPropName =>
  POINT_PROP_NAMES_SET.has(propName);

export const setPointProperty = <T>(node: Pixi.Container, name: PointPropName, value: T): void => {
  if (typeof value === "number") {
    (node as any)[name].set(value);
    return;
  }

  (node as any)[name].set((value as any).x, (value as any).y);
};

export const isPointAxisProperty = (propName: string): propName is PointAxisPropName =>
  POINT_PROP_AXIS_NAMES_SET.has(propName);

export const setPointAxisProperty = <T>(
  node: Pixi.Container,
  name: PointAxisPropName,
  value: T,
): void => {
  const axisInfo = POINT_PROP_AXIS_MAP.get(name);
  if (axisInfo) {
    (node as any)[axisInfo.propertyName][axisInfo.axisName] = value;
  }
};
