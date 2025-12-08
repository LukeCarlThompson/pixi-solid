import type { JSX } from "solid-js";
import { createRenderEffect, onCleanup, onMount } from "solid-js";
import { usePixiApp } from "./pixi-application";

/**
 * PixiCanvas
 *
 * A small wrapper that mounts the PIXI application's canvas element into the DOM
 * and automatically resizes it.
 *
 * - Requires a surrounding `PixiApplication` (accessed via `usePixiApp`).
 * - Requires a `PixiStage` component as a child.
 *
 * Props:
 * @param props.children - JSX content to render inside the canvas wrapper. Use
 *   `PixiStage` as the only child.
 *
 * **Example**
 * {@includeCode ./examples/PixiCanvas.example.tsx}
 *
 */

export const PixiCanvas = (props: {
  children: JSX.Element;
  style?: JSX.CSSProperties | undefined;
  className?: string;
}): JSX.Element => {
  let canvasWrapElement: HTMLDivElement | undefined;

  const pixiApp = usePixiApp();
  pixiApp.canvas.style.display = "block";

  createRenderEffect(() => {
    if (props.children === undefined) {
      throw new Error("PixiCanvas requires the `PixiStage` component to render.");
    }
  });

  let previousResizeTo: typeof pixiApp.resizeTo;
  let resizeObserver: ResizeObserver | undefined;

  onMount(() => {
    if (!canvasWrapElement) return;
    previousResizeTo = pixiApp.resizeTo;
    pixiApp.resizeTo = canvasWrapElement;
    pixiApp.queueResize();
    resizeObserver = new ResizeObserver(() => {
      pixiApp.queueResize();
    });
    resizeObserver.observe(canvasWrapElement);
  });

  onCleanup(() => {
    if (!canvasWrapElement) return;
    pixiApp.resizeTo = previousResizeTo;
    resizeObserver?.disconnect();
    resizeObserver = undefined;
  });

  return (
    <div
      ref={canvasWrapElement}
      style={{
        ...(typeof props.style === "object" ? props.style : {}),
      }}
      class={props.className}
    >
      {pixiApp.canvas}
    </div>
  );
};
