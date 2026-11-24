import { createStore, onCleanup } from "solid-js";

type ResizeRenderer = {
  screen: { width: number; height: number; x: number; y: number };
  addListener: (event: "resize", listener: () => void) => unknown;
  removeListener: (event: "resize", listener: () => void) => unknown;
};

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

export const createPixiScreenStore = (renderer: ResizeRenderer): Readonly<PixiScreenDimensions> => {
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
    setPixiScreen((screen) => {
      screen.width = renderer.screen.width;
      screen.height = renderer.screen.height;
      screen.x = renderer.screen.x;
      screen.y = renderer.screen.y;
    });
  };

  renderer.addListener("resize", handleResize);

  onCleanup(() => {
    renderer.removeListener("resize", handleResize);
  });

  return pixiScreen;
};
