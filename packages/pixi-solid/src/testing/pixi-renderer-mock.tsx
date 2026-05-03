import type * as Pixi from "pixi.js";
import type { JSX, ParentProps } from "solid-js";

import { PixiAppContext } from "../pixi-application";
import { createPixiScreenStore } from "../use-pixi-screen";

export type MockRenderer = {
  screen: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  addListener: (event: string, listener: () => void) => void;
  removeListener: (event: string, listener: () => void) => void;
  emitResize: (
    nextScreen?: Partial<{ width: number; height: number; x: number; y: number }>,
  ) => void;
};

export const createMockRenderer = (): MockRenderer => {
  const listeners = new Set<() => void>();

  const renderer: MockRenderer = {
    screen: {
      width: 800,
      height: 600,
      x: 0,
      y: 0,
    },
    addListener: (event, listener) => {
      if (event === "resize") {
        listeners.add(listener);
      }
    },
    removeListener: (event, listener) => {
      if (event === "resize") {
        listeners.delete(listener);
      }
    },
    emitResize: (nextScreen) => {
      if (nextScreen) {
        Object.assign(renderer.screen, nextScreen);
      }

      for (const listener of listeners) {
        listener();
      }
    },
  };

  return renderer;
};

export const createMockApp = (renderer: MockRenderer): Pixi.Application => {
  return { renderer } as unknown as Pixi.Application;
};

export const TestPixiProvider = (
  props: ParentProps<{ app: Pixi.Application; renderer: MockRenderer }>,
): JSX.Element => {
  const pixiScreenStore = createPixiScreenStore(props.renderer as unknown as Pixi.Renderer);

  return (
    <PixiAppContext.Provider
      value={{
        app: props.app,
        pixiScreenStore,
      }}
    >
      {props.children}
    </PixiAppContext.Provider>
  );
};
