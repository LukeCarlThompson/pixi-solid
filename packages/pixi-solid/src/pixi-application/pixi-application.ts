import type * as Pixi from "pixi.js";
import { Application } from "pixi.js";

export type PixiApplicationProps = Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

export const createPixiApplication = async (
  props?: PixiApplicationProps,
): Promise<Pixi.Application> => {
  // TODO: We should probably make as many of these props reactive as possible. We can use runWithOwner to get the context of the caller and make them reactive.
  const app = new Application();
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
};
