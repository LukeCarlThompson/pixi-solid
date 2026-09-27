import { createRoot, flush } from "solid-js";
import { describe, expect, it } from "vitest";

import { createPixiScreenStore } from "./pixi-screen-store";

type ResizeRenderer = Parameters<typeof createPixiScreenStore>[0];

type TestResizeRenderer = {
  renderer: ResizeRenderer;
  listeners: Set<() => void>;
  emitResize: (nextScreen: Partial<ResizeRenderer["screen"]>) => void;
};

const createTestRenderer = (): TestResizeRenderer => {
  const screen = { width: 800, height: 600, x: 0, y: 0 };
  const listeners = new Set<() => void>();

  const renderer: ResizeRenderer = {
    screen,
    addListener: (_event, listener) => {
      listeners.add(listener);
    },
    removeListener: (_event, listener) => {
      listeners.delete(listener);
    },
  };

  return {
    renderer,
    listeners,
    emitResize: (nextScreen) => {
      Object.assign(screen, nextScreen);
      listeners.forEach((listener) => listener());
    },
  };
};

describe("createPixiScreenStore", () => {
  it("GIVEN a screen store WHEN the renderer resizes THEN dimensions and bounds update", () => {
    // GIVEN
    const { renderer, emitResize } = createTestRenderer();
    const { screen, dispose } = createRoot((disposeRoot) => ({
      screen: createPixiScreenStore(renderer),
      dispose: disposeRoot,
    }));

    // WHEN
    emitResize({ width: 1024, height: 768, x: 12, y: 24 });
    flush();

    // THEN
    expect({ ...screen }).toEqual({
      width: 1024,
      height: 768,
      left: 12,
      right: 1036,
      top: 24,
      bottom: 792,
      x: 12,
      y: 24,
    });

    dispose();
  });

  it("GIVEN a screen store WHEN its root is disposed THEN the resize listener is removed", () => {
    // GIVEN
    const { renderer, listeners } = createTestRenderer();
    const { dispose } = createRoot((disposeRoot) => {
      createPixiScreenStore(renderer);
      return { dispose: disposeRoot };
    });

    // WHEN
    dispose();

    // THEN
    expect(listeners.size).toBe(0);
  });
});
