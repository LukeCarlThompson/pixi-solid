import type * as Pixi from "pixi.js";
import { children as resolveChildren, createRenderEffect } from "solid-js";
import type { JSX } from "solid-js";

export const addChildren = (parent: Pixi.Container | Pixi.RenderLayer, children?: JSX.Element) => {
  const resolvedChildren = resolveChildren(() => children);

  createRenderEffect(() => {
    const childrenArray = resolvedChildren.toArray() as unknown as Pixi.Container[];
    childrenArray.forEach((child) => {
      // RenderLayer uses `attach` instead of `addChild`.
      if ("attach" in parent && typeof parent.attach === "function") {
        parent.attach(child);
        return;
      }

      if (!("addChild" in parent) || typeof parent.addChild !== "function") {
        throw new Error("Parent does not support children.");
      }

      parent.addChild(child);
    });
  });
};
