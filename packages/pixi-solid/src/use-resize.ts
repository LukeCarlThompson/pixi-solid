import type * as Pixi from "pixi.js";
import { onCleanup } from "solid-js";
import { usePixiApp } from "./pixi-application";

/**
 * A SolidJS hook that runs a callback function whenever the PixiJS renderer is resized.
 *
 * @param resizeCallback A callback function that receives the updated screen dimensions as a `Pixi.Rectangle` object. This function will be called immediately upon hook initialization and then on every subsequent resize event.
 *
 * Because we listen for the renderer's "resize" event, this hook will work correctly whether the window is resized or just the DOM element the PixiCanvas is inside changes size.
 */
export const useResize = (resizeCallback: (screen: Pixi.Rectangle) => void): void => {
  const app = usePixiApp();

  app.renderer.screen.fit;

  const handleResize = () => {
    resizeCallback(app.renderer.screen);
  };

  // Call once to initialise
  handleResize();

  app.renderer.addListener("resize", handleResize);

  onCleanup(() => {
    app.renderer.removeListener("resize", handleResize);
  });
};
