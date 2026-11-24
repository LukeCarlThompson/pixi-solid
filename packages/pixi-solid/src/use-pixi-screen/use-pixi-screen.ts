import { useContext } from "solid-js";

import { ScreenStoreContext } from "../pixi-application/context";

import type { PixiScreenDimensions } from "./pixi-screen-store";

/**
 * A hook that provides a reactive object with the current dimensions of the
 * Pixi application's screen. Properties update automatically when the screen
 * size changes.
 *
 * Must be called within `PixiCanvas` or `PixiApplicationProvider`.
 *
 * @returns A reactive {@link PixiScreenDimensions} object with `width`, `height`,
 * `x`, `y`, `left`, `right`, `top`, `bottom` properties.
 */
export const usePixiScreen = (): Readonly<PixiScreenDimensions> => {
  try {
    return useContext(ScreenStoreContext);
  } catch {
    // Solid 2 throws a message-less error when the context has no provider.
    throw new Error("usePixiScreen must be used within a PixiApplicationProvider or PixiCanvas");
  }
};
