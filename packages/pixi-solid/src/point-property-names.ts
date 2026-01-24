const POINT_PROP_NAMES = [
  "position",
  "scale",
  "pivot",
  "skew",
  "anchor",
  "tilePosition",
  "tileScale",
] as const;

export const POINT_PROP_NAMES_SET: Set<string> = new Set(POINT_PROP_NAMES);

export const POINT_PROP_AXIS_NAMES = [
  "positionX",
  "positionY",
  "scaleX",
  "scaleY",
  "pivotX",
  "pivotY",
  "skewX",
  "skewY",
  "anchorX",
  "anchorY",
  "tilePositionX",
  "tilePositionY",
  "tileScaleX",
  "tileScaleY",
] as const;

export type PointAxisPropName = (typeof POINT_PROP_AXIS_NAMES)[number];

export const POINT_PROP_AXIS_NAMES_SET: Set<string> = new Set(POINT_PROP_AXIS_NAMES);

export const ALL_VALID_PROP_NAMES_SET: Set<string> = new Set([
  ...POINT_PROP_NAMES_SET,
  ...POINT_PROP_AXIS_NAMES_SET,
]);
