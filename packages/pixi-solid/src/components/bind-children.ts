import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import { children as resolveChildren, createRenderEffect, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";

export class InvalidChildTypeError extends Error {
  constructor(cause: Error) {
    super(
      "Invalid pixi-solid child type. Children must be pixi-solid or PixiJS element. Did you accidentally pass an invalid child to a pixi-solid parent?",
      { cause },
    );
    this.name = "InvalidChildTypeError";
  }
}

const getPixiChildren = (resolvedChildren: ReturnType<typeof resolveChildren>) =>
  resolvedChildren.toArray().filter(Boolean) as unknown as Pixi.Container[];

export const bindChildrenToContainer = (
  parent: Pixi.Container,
  children: Accessor<JSX.Element> = () => undefined,
): void => {
  const resolvedChildren = resolveChildren(children);

  if (!("addChildAt" in parent)) {
    throw new Error("Parent does not support children.");
  }

  onCleanup(() => {
    const boundChildren = getPixiChildren(resolvedChildren);

    // Detach, but do not destroy, children added by this binding. The owning
    // pixi-solid components are responsible for destroying themselves.
    for (const child of boundChildren) {
      parent.removeChild?.(child);
    }
  });

  createRenderEffect(
    () => getPixiChildren(resolvedChildren),
    (nextChildren, previousChildren = []) => {
      try {
        for (const child of previousChildren) {
          if (!nextChildren.includes(child)) parent.removeChild?.(child);
        }

        for (let index = 0; index < nextChildren.length; index += 1) {
          parent.addChildAt(nextChildren[index], index);
        }
      } catch (error) {
        if (error instanceof Error) throw new InvalidChildTypeError(error);
        throw error;
      }
    },
  );
};

export const bindChildrenToRenderLayer = (
  parent: Pixi.RenderLayer,
  children: Accessor<JSX.Element> = () => undefined,
): void => {
  const resolvedChildren = resolveChildren(children);

  onCleanup(() => {
    for (const child of getPixiChildren(resolvedChildren)) {
      parent.detach(child);
    }
  });

  createRenderEffect(
    () => getPixiChildren(resolvedChildren),
    (nextChildren, previousChildren = []) => {
      try {
        for (const child of previousChildren) {
          if (!nextChildren.includes(child)) parent.detach(child);
        }

        for (const child of nextChildren) {
          parent.attach(child);
        }
      } catch (error) {
        if (error instanceof Error) throw new InvalidChildTypeError(error);
        throw error;
      }
    },
  );
};
