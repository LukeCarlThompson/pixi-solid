import type * as Pixi from "pixi.js";
import { onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

export type PixiScreenDimensions = {
  width: number;
  height: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
  x: number;
  y: number;
};

export const createPixiScreenStore = (renderer: Pixi.Renderer): Readonly<PixiScreenDimensions> => {
  const [pixiScreen, setPixiScreen] = createStore<PixiScreenDimensions>({
    width: renderer.screen.width,
    height: renderer.screen.height,
    get left() {
      return this.x;
    },
    get right() {
      return this.x + this.width;
    },
    get top() {
      return this.y;
    },
    get bottom() {
      return this.y + this.height;
    },
    x: renderer.screen.x,
    y: renderer.screen.y,
  });

  const handleResize = () => {
    setPixiScreen(renderer.screen);
  };

  renderer.addListener("resize", handleResize);

  onCleanup(() => {
    renderer.removeListener("resize", handleResize);
  });

  return pixiScreen;
};
