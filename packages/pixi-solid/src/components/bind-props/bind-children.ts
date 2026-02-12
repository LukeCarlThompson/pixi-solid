import type * as Pixi from "pixi.js";
import { children as resolveChildren, createRenderEffect } from "solid-js";
import type { JSX } from "solid-js";

export const bindChildrenToContainer = (parent: Pixi.Container, children?: JSX.Element) => {
  const resolvedChildren = resolveChildren(() => children);

  const canAddChild = "addChildAt" in parent;

  if (!canAddChild) {
    throw new Error("Parent does not support children.");
  }

  createRenderEffect((prevChildren: Pixi.Container[] | undefined) => {
    const nextChildren = resolvedChildren.toArray() as unknown as Pixi.Container[];

    if (prevChildren) {
      for (let i = 0; i < prevChildren.length; i += 1) {
        const child = prevChildren[i];
        if (nextChildren.includes(child)) continue;
        parent.removeChild(child);
        child.destroy({ children: true });
      }
    }

    for (let i = 0; i < nextChildren.length; i += 1) {
      parent.addChildAt(nextChildren[i], i);
    }

    return nextChildren;
  });
};

export const bindChildrenToRenderLayer = (parent: Pixi.RenderLayer, children?: JSX.Element) => {
  const resolvedChildren = resolveChildren(() => children);

  createRenderEffect((prevChildren: Pixi.Container[] | undefined) => {
    const nextChildren = resolvedChildren.toArray() as unknown as Pixi.Container[];

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

    return nextChildren;
  });
};
