// Common point properties available on all Container-based components
export const COMMON_POINT_PROP_NAMES = ["position", "scale", "pivot", "skew"] as const;

export type CommonPointPropName = (typeof COMMON_POINT_PROP_NAMES)[number];

// Anchor properties only available on Sprite-like components (Sprite, Text, etc.)
export const ANCHOR_POINT_PROP_NAMES = ["anchor"] as const;

export type AnchorPointPropName = (typeof ANCHOR_POINT_PROP_NAMES)[number];

// Tiling properties only available on TilingSprite
export const TILING_POINT_PROP_NAMES = ["tilePosition", "tileScale"] as const;

export type TilingPointPropName = (typeof TILING_POINT_PROP_NAMES)[number];

// All point properties (for runtime checking)
export const POINT_PROP_NAMES = [
  ...COMMON_POINT_PROP_NAMES,
  ...ANCHOR_POINT_PROP_NAMES,
  ...TILING_POINT_PROP_NAMES,
] as const;

export type PointPropName = (typeof POINT_PROP_NAMES)[number];

export const POINT_PROP_NAMES_SET: Set<string> = new Set(POINT_PROP_NAMES);

// Common axis properties available on all Container-based components
export const COMMON_POINT_PROP_AXIS_NAMES = [
  "positionX",
  "positionY",
  "scaleX",
  "scaleY",
  "pivotX",
  "pivotY",
  "skewX",
  "skewY",
] as const;

export type CommonPointAxisPropName = (typeof COMMON_POINT_PROP_AXIS_NAMES)[number];

// Anchor axis properties only available on Sprite-like components
export const ANCHOR_POINT_PROP_AXIS_NAMES = ["anchorX", "anchorY"] as const;

export type AnchorPointAxisPropName = (typeof ANCHOR_POINT_PROP_AXIS_NAMES)[number];

// Tiling axis properties only available on TilingSprite
export const TILING_POINT_PROP_AXIS_NAMES = [
  "tilePositionX",
  "tilePositionY",
  "tileScaleX",
  "tileScaleY",
] as const;

export type TilingPointAxisPropName = (typeof TILING_POINT_PROP_AXIS_NAMES)[number];

// All axis properties (for runtime checking)
export const POINT_PROP_AXIS_NAMES = [
  ...COMMON_POINT_PROP_AXIS_NAMES,
  ...ANCHOR_POINT_PROP_AXIS_NAMES,
  ...TILING_POINT_PROP_AXIS_NAMES,
] as const;

export type PointAxisPropName = (typeof POINT_PROP_AXIS_NAMES)[number];

export const POINT_PROP_AXIS_NAMES_SET: Set<string> = new Set(POINT_PROP_AXIS_NAMES);

export const ALL_VALID_PROP_NAMES_SET: Set<string> = new Set([
  ...POINT_PROP_NAMES_SET,
  ...POINT_PROP_AXIS_NAMES_SET,
]);

export const POINT_PROP_AXIS_MAP = POINT_PROP_AXIS_NAMES.reduce((map, name) => {
  const axisName = name[name.length - 1].toLowerCase() as "x" | "y";
  const propertyName = name.slice(0, -1);
  map.set(name, { propertyName, axisName });
  return map;
}, new Map<string, { propertyName: string; axisName: "x" | "y" }>());
