import { useContext } from "solid-js";

import { PixiAppContext } from "../pixi-application";

import type { PixiScreenDimensions } from "./pixi-screen-store";

/**
 *
 * A hook that provides the current dimensions of the Pixi application's screen as a reactive object.
 * The properties of the returned object will update automatically when the screen size changes and can be subscribed to reactively.
 *
 * This hook must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.
 *
 * @returns An object containing the width and height of the Pixi screen.
 */
export const usePixiScreen = (): Readonly<PixiScreenDimensions> => {
  const pixiAppContext = useContext(PixiAppContext);
  if (!pixiAppContext) {
    throw new Error("usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas");
  }
  return pixiAppContext.pixiScreenStore;
};
