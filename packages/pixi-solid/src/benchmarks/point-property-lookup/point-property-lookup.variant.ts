const POINT_PROP_NAMES = [
  "position",
  "scale",
  "pivot",
  "skew",
  "anchor",
  "tilePosition",
  "tileScale",
] as const;

const POINT_PROP_AXIS_NAMES = [
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

const ALL_VALID_PROP_NAMES_SET: Set<string> = new Set([
  ...POINT_PROP_NAMES,
  ...POINT_PROP_AXIS_NAMES,
]);
const ALL_VALID_PROP_NAMES_ARRAY: string[] = [...POINT_PROP_NAMES, ...POINT_PROP_AXIS_NAMES];

export const arrayLookup = (name: string): boolean => ALL_VALID_PROP_NAMES_ARRAY.includes(name);

export const setLookup = (name: string): boolean => ALL_VALID_PROP_NAMES_SET.has(name);
