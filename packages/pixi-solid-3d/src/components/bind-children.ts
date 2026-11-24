import type * as Pixi3D from "@pixi/3d";
import { children as resolveChildren, createRenderEffect, onCleanup } from "solid-js";
import type { JSX } from "solid-js";

export class Invalid3DChildTypeError extends Error {
  constructor(cause: Error) {
    super(
      "Invalid pixi-solid-3d child type. Children of Container3D must be Container3D elements. Did you accidentally pass a 2D pixi element to a 3D container?",
      { cause },
    );
    this.name = "Invalid3DChildTypeError";
  }
}

/**
 * Binds JSX children to a Container3D parent.
 * Reactively adds and removes children in Container3D draw order.
 */
export const bindChildrenToContainer3D = (
  parent: Pixi3D.Container3D,
  children?: JSX.Element,
): void => {
  const resolvedChildren = resolveChildren(() => children);

  const canAddChild = typeof parent.addChildAt === "function";
  if (!canAddChild) {
    throw new Error("Parent does not support Container3D children.");
  }

  onCleanup(() => {
    const boundChildren = resolvedChildren
      .toArray()
      .filter(Boolean) as unknown as Pixi3D.Container3D[];
    for (let i = 0; i < boundChildren.length; i += 1) {
      if (parent.children.includes(boundChildren[i])) {
        parent.removeChild?.(boundChildren[i]);
      }
    }
  });

  createRenderEffect((prevChildren: Pixi3D.Container3D[] | undefined) => {
    const nextChildren = resolvedChildren
      .toArray()
      .filter(Boolean) as unknown as Pixi3D.Container3D[];

    try {
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i += 1) {
          const child = prevChildren[i];
          if (nextChildren.includes(child)) continue;
          parent.removeChild?.(child);
        }
      }

      for (let i = 0; i < nextChildren.length; i += 1) {
        const nextChild = nextChildren[i];
        if (nextChild.parent === parent) {
          // If already child, we can swap or re-index if needed
          const currentIndex = parent.children.indexOf(nextChild);
          if (currentIndex !== i) {
            parent.addChildAt(nextChild, i);
          }
        } else {
          parent.addChild(nextChild);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Invalid3DChildTypeError(error);
      } else {
        throw error;
      }
    }

    return nextChildren;
  });
};
