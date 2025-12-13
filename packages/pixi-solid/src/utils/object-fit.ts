import type * as Pixi from "pixi.js";

export type ObjectFitMode = "cover" | "contain" | "fill" | "scale-down";

/**
 * Scale an object to fit within the given bounds according to the specified fit mode.
 * @param object The object to be scaled.
 * @param bounds The bounds it should fit within.
 * @param fitMode The object fit mode to apply.
 */
export const objectFit = (
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
): void => {
  const originalWidth = object.width / object.scale.x;
  const originalHeight = object.height / object.scale.y;

  if (originalWidth === 0 || originalHeight === 0 || bounds.width === 0 || bounds.height === 0)
    return;

  const widthRatio = bounds.width / originalWidth;
  const heightRatio = bounds.height / originalHeight;

  let scaleX = 1;
  let scaleY = 1;

  switch (fitMode) {
    case "cover": {
      const coverScale = Math.max(widthRatio, heightRatio);
      scaleX = coverScale;
      scaleY = coverScale;
      break;
    }
    case "contain": {
      const containScale = Math.min(widthRatio, heightRatio);
      scaleX = containScale;
      scaleY = containScale;
      break;
    }
    case "fill": {
      scaleX = widthRatio;
      scaleY = heightRatio;
      break;
    }
    case "scale-down": {
      // If the object is smaller than the container, it's 'none' (no scaling up).
      // Otherwise, it's 'contain'.
      if (originalWidth <= bounds.width && originalHeight <= bounds.height) {
        scaleX = 1;
        scaleY = 1;
      } else {
        const scaleDown = Math.min(widthRatio, heightRatio);
        scaleX = scaleDown;
        scaleY = scaleDown;
      }
      break;
    }
    default:
      // Default to no scaling if an unknown fitMode is provided
      break;
  }

  object.scale.set(scaleX, scaleY);

  // Center the object
  object.x = (bounds.width - object.width) / 2;
  object.y = (bounds.height - object.height) / 2;
};
