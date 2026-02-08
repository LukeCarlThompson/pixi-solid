import type * as Pixi from "pixi.js";
import { onCleanup } from "solid-js";
import { getPixiApp } from "./pixi-application";

/**
 *
 * A SolidJS hook that runs a callback function whenever the PixiJS renderer is resized.
 * The callback is automatically removed when the component or hook's owning computation is cleaned up.
 *
 * This hook must be called from a component that is a descendant of `PixiCanvas` or `PixiApplicationProvider`.
 *
 * @param resizeCallback - A callback function that receives the updated screen dimensions as a `Pixi.Rectangle` object. This function will be called immediately upon hook initialization and then on every subsequent resize event.
 *
 * We listen for the renderer's "resize" event so this hook will work correctly whether the window is resized or just the DOM element the PixiCanvas is inside of changes size.
 */
export const onResize = (resizeCallback: (screen: Pixi.Rectangle) => void): void => {
  const app = getPixiApp();

  if (!app) {
    throw new Error("onResize must be used within a PixiApplicationProvider or a PixiCanvas");
  }

  const handleResize = () => {
    resizeCallback(app.renderer.screen);
  };

  handleResize();

  app.renderer.addListener("resize", handleResize);

  onCleanup(() => {
    app.renderer.removeListener("resize", handleResize);
  });
};
