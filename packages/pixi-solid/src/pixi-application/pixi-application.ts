import type * as Pixi from "pixi.js";
import { Application } from "pixi.js";

export type PixiApplicationProps = Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

export const createPixiApplication = async (
  props?: PixiApplicationProps,
  onCreate?: (app: Pixi.Application) => void,
): Promise<Pixi.Application> => {
  const app = new Application();
  onCreate?.(app);

  try {
    await app.init({
      resolution: window.devicePixelRatio,
      autoDensity: true,
      ...props,
    });

    app.canvas.style.display = "block";
    app.canvas.style.position = "absolute";
    app.canvas.style.top = "0";
    app.canvas.style.left = "0";
    app.canvas.style.width = "100%";
    app.canvas.style.height = "100%";

    return app;
  } catch (initializationError) {
    try {
      if (app.renderer) {
        app.destroy(true, { children: true });
      } else {
        app.stage.destroy({ children: true });
      }
    } catch (cleanupError) {
      throw new AggregateError(
        [initializationError, cleanupError],
        "Pixi application initialization and cleanup failed",
      );
    }

    throw initializationError;
  }
};
