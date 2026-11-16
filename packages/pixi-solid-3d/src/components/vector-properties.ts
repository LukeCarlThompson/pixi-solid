import type * as Pixi3D from "@pixi/3d";

/**
 * Direct vector property names available on all Container3D-based components:
 * position, scale, rotation, angle, quaternion, origin.
 */
export const CONTAINER3D_VECTOR_PROP_NAMES = [
  "position",
  "scale",
  "rotation",
  "angle",
  "quaternion",
  "origin",
  "lookAt",
] as const;

export type Container3DVectorPropName = (typeof CONTAINER3D_VECTOR_PROP_NAMES)[number];
export const CONTAINER3D_VECTOR_PROP_NAMES_SET: Set<string> = new Set(
  CONTAINER3D_VECTOR_PROP_NAMES,
);

/**
 * Axis-specific property names for Container3D:
 * positionX, positionY, positionZ,
 * scaleX, scaleY, scaleZ,
 * rotationX, rotationY, rotationZ,
 * angleX, angleY, angleZ,
 * originX, originY, originZ
 */
export const CONTAINER3D_AXIS_PROP_NAMES = [
  "positionX",
  "positionY",
  "positionZ",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotationX",
  "rotationY",
  "rotationZ",
  "angleX",
  "angleY",
  "angleZ",
  "originX",
  "originY",
  "originZ",
  "lookAtX",
  "lookAtY",
  "lookAtZ",
] as const;

export type Container3DAxisPropName = (typeof CONTAINER3D_AXIS_PROP_NAMES)[number];
export const CONTAINER3D_AXIS_PROP_NAMES_SET: Set<string> = new Set(CONTAINER3D_AXIS_PROP_NAMES);

/**
 * Top-level axis coordinates on Container3D:
 * x, y, z
 */
export const TOP_LEVEL_AXIS_PROP_NAMES = ["x", "y", "z"] as const;
export type TopLevelAxisPropName = (typeof TOP_LEVEL_AXIS_PROP_NAMES)[number];
export const TOP_LEVEL_AXIS_PROP_NAMES_SET: Set<string> = new Set(TOP_LEVEL_AXIS_PROP_NAMES);

export type Container3DAxisInfo = {
  propertyName: "position" | "scale" | "rotation" | "angle" | "origin" | "lookAt";
  axisName: "x" | "y" | "z";
};

export const CONTAINER3D_AXIS_MAP = new Map<Container3DAxisPropName, Container3DAxisInfo>([
  ["positionX", { propertyName: "position", axisName: "x" }],
  ["positionY", { propertyName: "position", axisName: "y" }],
  ["positionZ", { propertyName: "position", axisName: "z" }],
  ["scaleX", { propertyName: "scale", axisName: "x" }],
  ["scaleY", { propertyName: "scale", axisName: "y" }],
  ["scaleZ", { propertyName: "scale", axisName: "z" }],
  ["rotationX", { propertyName: "rotation", axisName: "x" }],
  ["rotationY", { propertyName: "rotation", axisName: "y" }],
  ["rotationZ", { propertyName: "rotation", axisName: "z" }],
  ["angleX", { propertyName: "angle", axisName: "x" }],
  ["angleY", { propertyName: "angle", axisName: "y" }],
  ["angleZ", { propertyName: "angle", axisName: "z" }],
  ["originX", { propertyName: "origin", axisName: "x" }],
  ["originY", { propertyName: "origin", axisName: "y" }],
  ["originZ", { propertyName: "origin", axisName: "z" }],
  ["lookAtX", { propertyName: "lookAt", axisName: "x" }],
  ["lookAtY", { propertyName: "lookAt", axisName: "y" }],
  ["lookAtZ", { propertyName: "lookAt", axisName: "z" }],
]);

export const isVector3DProperty = (propName: string): propName is Container3DVectorPropName =>
  CONTAINER3D_VECTOR_PROP_NAMES_SET.has(propName);

export const isAxis3DProperty = (propName: string): propName is Container3DAxisPropName =>
  CONTAINER3D_AXIS_PROP_NAMES_SET.has(propName);

export const isTopLevelAxisProperty = (propName: string): propName is TopLevelAxisPropName =>
  TOP_LEVEL_AXIS_PROP_NAMES_SET.has(propName);

// WeakMap storing cached lookAt targets per node for individual axis updates
const lookAtTargetCache = new WeakMap<Pixi3D.Container3D, { x: number; y: number; z: number }>();

export const getOrCreateLookAtTarget = (
  node: Pixi3D.Container3D,
): { x: number; y: number; z: number } => {
  let target = lookAtTargetCache.get(node);
  if (!target) {
    target = { x: 0, y: 0, z: 0 };
    lookAtTargetCache.set(node, target);
  }
  return target;
};

/**
 * Sets a vector property on a Container3D instance
 */
export const setVector3DProperty = <T>(
  node: Pixi3D.Container3D,
  name: Container3DVectorPropName,
  value: T,
): void => {
  if (value === undefined || value === null) return;

  if (name === "quaternion") {
    node.quaternion = value as unknown as Pixi3D.QuaternionData;
    return;
  }

  if (name === "lookAt") {
    const point = value as unknown as Partial<Pixi3D.PointData3D>;
    const target = getOrCreateLookAtTarget(node);
    target.x = point.x ?? target.x;
    target.y = point.y ?? target.y;
    target.z = point.z ?? target.z;
    node.lookAt(target);
    return;
  }

  if (typeof value === "number") {
    if (name === "scale") {
      node.scale = value;
    } else if (name === "origin") {
      node.origin = value;
    } else if ("set" in (node as any)[name]) {
      (node as any)[name].set(value, value, value);
    }
    return;
  }

  const point = value as unknown as Partial<Pixi3D.PointData3D>;
  const current = (node as any)[name];

  if (current && typeof current.set === "function") {
    const x = point.x ?? current.x ?? 0;
    const y = point.y ?? current.y ?? 0;
    const z = point.z ?? current.z ?? 0;
    current.set(x, y, z);
  } else {
    (node as any)[name] = value;
  }
};

/**
 * Sets an axis property (e.g. positionX, scaleZ, angleY, lookAtX) on a Container3D instance
 */
export const setAxis3DProperty = <T>(
  node: Pixi3D.Container3D,
  name: Container3DAxisPropName,
  value: T,
): void => {
  const axisInfo = CONTAINER3D_AXIS_MAP.get(name);
  if (!axisInfo) return;

  if (axisInfo.propertyName === "lookAt") {
    const target = getOrCreateLookAtTarget(node);
    target[axisInfo.axisName] = (value as unknown as number) ?? 0;
    node.lookAt(target);
    return;
  }

  const axisTarget = (node as any)[axisInfo.propertyName];
  if (axisTarget && axisInfo.axisName in axisTarget) {
    axisTarget[axisInfo.axisName] = value;
  }
};
