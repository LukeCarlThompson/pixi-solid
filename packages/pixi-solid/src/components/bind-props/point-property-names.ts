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

/**
 * Axis-specific point property names available on all Container-based components:
 * `positionX`, `positionY`, `scaleX`, `scaleY`, `pivotX`, `pivotY`, `skewX`, `skewY`.
 */
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

/** A single axis-specific point property name available on all Container-based components. */
export type CommonPointAxisPropName = (typeof COMMON_POINT_PROP_AXIS_NAMES)[number];

/** Axis-specific anchor property names available on Sprite-like components: `anchorX`, `anchorY`. */
export const ANCHOR_POINT_PROP_AXIS_NAMES = ["anchorX", "anchorY"] as const;

/** A single axis-specific anchor property name available on Sprite-like components. */
export type AnchorPointAxisPropName = (typeof ANCHOR_POINT_PROP_AXIS_NAMES)[number];

/**
 * Axis-specific tiling property names available on TilingSprite:
 * `tilePositionX`, `tilePositionY`, `tileScaleX`, `tileScaleY`.
 */
export const TILING_POINT_PROP_AXIS_NAMES = [
  "tilePositionX",
  "tilePositionY",
  "tileScaleX",
  "tileScaleY",
] as const;

/** A single axis-specific tiling property name available on TilingSprite. */
export type TilingPointAxisPropName = (typeof TILING_POINT_PROP_AXIS_NAMES)[number];

// All axis properties (for runtime checking)
export const POINT_PROP_AXIS_NAMES = [
  ...COMMON_POINT_PROP_AXIS_NAMES,
  ...ANCHOR_POINT_PROP_AXIS_NAMES,
  ...TILING_POINT_PROP_AXIS_NAMES,
] as const;

/** Any axis-specific point property name across all component types. */
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
