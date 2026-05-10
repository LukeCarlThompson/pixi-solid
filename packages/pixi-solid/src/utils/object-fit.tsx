import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";
import { createEffect, splitProps, children, Index, onCleanup, on } from "solid-js";

import type { PixiComponentProps } from "../components";
import { Container } from "../components/components";
import { onTick } from "../on-tick";

export type ObjectFitMode = "cover" | "contain" | "fill" | "scale-down" | "none";

export type ObjectPosition =
  | "center"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | { x: number; y: number };

const objectFitWithLocalBounds = (
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
  position: ObjectPosition,
  localBounds: { x: number; y: number; width: number; height: number },
): void => {
  const originalWidth = localBounds.width;
  const originalHeight = localBounds.height;

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
      scaleX = scaleY = Math.min(1, Math.min(widthRatio, heightRatio));
      break;
    }
    case "none":
      break;
  }

  object.scale.set(scaleX, scaleY);
  const resolvedPosition = resolveObjectPosition(position);
  const scaledWidth = localBounds.width * scaleX;
  const scaledHeight = localBounds.height * scaleY;

  object.x = -localBounds.x * scaleX + (bounds.width - scaledWidth) * resolvedPosition.x;
  object.y = -localBounds.y * scaleY + (bounds.height - scaledHeight) * resolvedPosition.y;
};

const resolveObjectPosition = (position: ObjectPosition | undefined): { x: number; y: number } => {
  const defaultPosition = { x: 0.5, y: 0.5 };

  if (!position) {
    return defaultPosition;
  }

  if (typeof position === "object") {
    return position;
  }

  switch (position) {
    case "top":
      return { x: 0.5, y: 0 };
    case "right":
      return { x: 1, y: 0.5 };
    case "bottom":
      return { x: 0.5, y: 1 };
    case "left":
      return { x: 0, y: 0.5 };
    case "top-left":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: 1, y: 0 };
    case "bottom-left":
      return { x: 0, y: 1 };
    case "bottom-right":
      return { x: 1, y: 1 };
    case "center":
    default:
      return defaultPosition;
  }
};

/**
 * Scale an object to fit within the given bounds according to the specified fit mode.
 *
 * This function sets the scale and position properties of the object to fit within the bounds while respecting the aspect ratio based on the fit mode.
 *
 * @param object The object to be scaled.
 * @param bounds The bounds it should fit within.
 * @param fitMode The object fit mode to apply.
 * @param position Optional object position anchor. Defaults to center.
 */
export const objectFit = (
  object: Pixi.Container,
  bounds: { width: number; height: number },
  fitMode: ObjectFitMode,
  position: ObjectPosition = "center",
): void => {
  objectFitWithLocalBounds(object, bounds, fitMode, position, object.getLocalBounds());
};

export type ObjectFitContainerProps = PixiComponentProps & {
  width: number;
  height: number;
  children: JSX.Element;
  fitMode: ObjectFitMode;
  objectPosition?: ObjectPosition;
  observeBounds?: boolean;
};

/**
 * This component allows the parent container to dictate the size of its children.
 *
 * Each child is wrapped in a container and object-fit scaling is applied to the wrapping container based on the width and height values passed as props.
 *
 * If multiple children are passed, each one will be wrapped, scaled and positioned independently according to the fit mode and object position.
 *
 * If you want to apply the same object-fit behavior to multiple children as a group, wrap them in a parent `Container` and pass that single container as the child to `ObjectFitContainer`.
 *
 * Accepts all standard pixi-solid `Container` props (position, scale, mask, events, etc.) on the outer
 * container. The `width`, `height`, `fitMode`, and `objectPosition` props control how children are scaled
 * and aligned within the bounds. Set `observeBounds={true}` to enable ticker-based local-bounds watching.
 *
 * @example
 * ```tsx
 * <ObjectFitContainer x={100} y={100} width={800} height={600} fitMode="contain" objectPosition="top-left">
 *   <Sprite texture={texture} />
 * </ObjectFitContainer>
 * ```
 */
export const ObjectFitContainer = (props: ObjectFitContainerProps): JSX.Element => {
  const [local, rest] = splitProps(props, [
    "width",
    "height",
    "fitMode",
    "objectPosition",
    "observeBounds",
    "children",
  ]);

  const resolvedChildren = children(() => local.children);
  const innerContainerSet = new Set<Pixi.Container>();
  const cachedBoundsMap = new WeakMap<
    Pixi.Container,
    { x: number; y: number; width: number; height: number }
  >();

  createEffect(() => {
    void local.width;
    void local.height;
    void local.fitMode;
    void local.objectPosition;

    for (const child of innerContainerSet) {
      objectFit(child, local, local.fitMode, local.objectPosition);
    }
  });

  createEffect(
    on(
      () => local.observeBounds,
      (observeBounds) => {
        if (observeBounds !== true) {
          return;
        }

        onTick(() => {
          for (const child of innerContainerSet) {
            const nextLocalBounds = child.getLocalBounds();
            let previousLocalBounds = cachedBoundsMap.get(child);

            if (
              !previousLocalBounds ||
              previousLocalBounds.x !== nextLocalBounds.x ||
              previousLocalBounds.y !== nextLocalBounds.y ||
              previousLocalBounds.width !== nextLocalBounds.width ||
              previousLocalBounds.height !== nextLocalBounds.height
            ) {
              if (!previousLocalBounds) {
                previousLocalBounds = {
                  x: nextLocalBounds.x,
                  y: nextLocalBounds.y,
                  width: nextLocalBounds.width,
                  height: nextLocalBounds.height,
                };
                cachedBoundsMap.set(child, previousLocalBounds);
              } else {
                previousLocalBounds.x = nextLocalBounds.x;
                previousLocalBounds.y = nextLocalBounds.y;
                previousLocalBounds.width = nextLocalBounds.width;
                previousLocalBounds.height = nextLocalBounds.height;
              }

              objectFitWithLocalBounds(
                child,
                local,
                local.fitMode,
                local.objectPosition ?? "center",
                nextLocalBounds,
              );
            }
          }
        });
      },
    ),
  );

  return (
    <Container {...rest}>
      <Index each={resolvedChildren.toArray()}>
        {(child, index) => {
          return (
            <Container
              label={`object-fit-child-wrapper-${index}`}
              ref={(el) => {
                innerContainerSet.add(el);
                onCleanup(() => {
                  innerContainerSet.delete(el);
                });
              }}
            >
              {child()}
            </Container>
          );
        }}
      </Index>
    </Container>
  );
};
