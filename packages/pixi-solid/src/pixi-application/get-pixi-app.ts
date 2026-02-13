import type * as Pixi from "pixi.js";
import { useContext } from "solid-js";

import { PixiAppContext } from "./context";

/**
 * A custom SolidJS hook to access the root Pixi.Application instance.
 * This hook must be called from a component that is a descendant of `PixiApplicationProvider` or `PixiCanvas`.
 *
 * @returns The Pixi.Application instance provided by the `PixiApplication` component.
 */
export const getPixiApp = (): Pixi.Application => {
  const appContext = useContext(PixiAppContext);

  if (!appContext) {
    throw new Error("getPixiApp must be used within a PixiApplicationProvider or a PixiCanvas");
  }

  return appContext.app;
};
