import type * as Pixi from "pixi.js";
import { children as resolveChildren, createRenderEffect } from "solid-js";
import type { JSX } from "solid-js";

export class InvalidChildTypeError extends Error {
  constructor(cause: Error) {
    super(
      "Invalid pixi-solid child type. Children must be pixi-solid or PixiJS element. Did you accidentally pass an invalid child to a pixi-solid parent?",
      { cause },
    );
    this.name = "InvalidChildTypeError";
  }
}

export const bindChildrenToContainer = (parent: Pixi.Container, children?: JSX.Element): void => {
  const resolvedChildren = resolveChildren(() => children);

  const canAddChild = "addChildAt" in parent;

  if (!canAddChild) {
    throw new Error("Parent does not support children.");
  }

  createRenderEffect(() => {
    const nextChildren = resolvedChildren.toArray().filter(Boolean) as unknown as Pixi.Container[];

    try {
      for (let i = 0; i < nextChildren.length; i += 1) {
        parent.addChildAt(nextChildren[i], i);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Invalid children", nextChildren);
        throw new InvalidChildTypeError(error);
      } else {
        throw error;
      }
    }
  });
};

export const bindChildrenToRenderLayer = (
  parent: Pixi.RenderLayer,
  children?: JSX.Element,
): void => {
  const resolvedChildren = resolveChildren(() => children);

  createRenderEffect((prevChildren: Pixi.Container[] | undefined) => {
    const nextChildren = resolvedChildren.toArray().filter(Boolean) as unknown as Pixi.Container[];

    try {
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i += 1) {
          const child = prevChildren[i];
          if (nextChildren.includes(child)) continue;

          parent.detach(child);
        }
      }

      for (let i = 0; i < nextChildren.length; i += 1) {
        parent.attach(nextChildren[i]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Invalid children", nextChildren);
        throw new InvalidChildTypeError(error);
      } else {
        throw error;
      }
    }

    return nextChildren;
  });
};
