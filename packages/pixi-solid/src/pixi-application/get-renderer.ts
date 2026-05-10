import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { PixiAppContext } from "./context";

/**
 * A custom SolidJS hook to access the root Pixi Renderer instance.
 * This hook must be called from a component that is a descendant of `PixiApplicationProvider` or `PixiCanvas`.
 *
 * @returns The Pixi.Renderer instance.
 */
export const getRenderer = (): Pixi.Renderer => {
  const appContext = useContext(PixiAppContext);

  if (!appContext) {
    throw new Error("getRenderer must be used within a PixiApplicationProvider or a PixiCanvas");
  }

  return appContext.renderer;
};
