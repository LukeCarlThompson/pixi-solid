import { useContext } from "solid-js";

import { ScreenStoreContext } from "../pixi-application";

import type { PixiScreenDimensions } from "./pixi-screen-store";

/**
 *
 * A hook that provides an object with the current dimensions of the Pixi application's screen as signals.
 * The properties of the returned object will update automatically when the screen size changes and can be subscribed to.
 *
 * This hook must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.
 *
 */
export const usePixiScreen = (): Readonly<PixiScreenDimensions> => {
  const pixiScreenStore = useContext(ScreenStoreContext);
  if (!pixiScreenStore) {
    throw new Error("usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas");
  }
  return pixiScreenStore;
};
