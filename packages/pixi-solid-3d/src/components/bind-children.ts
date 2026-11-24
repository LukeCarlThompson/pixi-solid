import type * as Pixi3D from "@pixi/3d";
import type { JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";
import { children as resolveChildren, createRenderEffect, onCleanup } from "solid-js";

export class Invalid3DChildTypeError extends Error {
  constructor(cause: Error) {
    super(
      "Invalid pixi-solid-3d child type. Children of Container3D must be Container3D elements. Did you accidentally pass a 2D pixi element to a 3D container?",
      { cause },
    );
    this.name = "Invalid3DChildTypeError";
  }
}

const getContainer3DChildren = (resolvedChildren: ReturnType<typeof resolveChildren>) =>
  resolvedChildren.toArray().filter(Boolean) as unknown as Pixi3D.Container3D[];

/**
 * Binds JSX children to a Container3D parent.
 * Reactively adds and removes children in Container3D draw order.
 */
export const bindChildrenToContainer3D = (
  parent: Pixi3D.Container3D,
  children: Accessor<JSX.Element> = () => undefined,
): void => {
  const resolvedChildren = resolveChildren(children);

  const canAddChild = typeof parent.addChildAt === "function";
  if (!canAddChild) {
    throw new Error("Parent does not support Container3D children.");
  }

  onCleanup(() => {
    for (const child of getContainer3DChildren(resolvedChildren)) {
      parent.removeChild?.(child);
    }
  });

  createRenderEffect(
    () => getContainer3DChildren(resolvedChildren),
    (nextChildren, previousChildren = []) => {
      try {
        for (const child of previousChildren) {
          if (!nextChildren.includes(child)) parent.removeChild?.(child);
        }

        for (let index = 0; index < nextChildren.length; index += 1) {
          const nextChild = nextChildren[index];

          // An existing child only needs re-indexing when its draw order moved.
          if (nextChild.parent === parent) {
            if (parent.children.indexOf(nextChild) !== index) {
              parent.addChildAt(nextChild, index);
            }
          } else {
            parent.addChild(nextChild);
          }
        }
      } catch (error) {
        if (error instanceof Error) throw new Invalid3DChildTypeError(error);
        throw error;
      }
    },
  );
};
