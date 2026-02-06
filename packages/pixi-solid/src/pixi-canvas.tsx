import type { JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";
import { applyProps } from "./component-creation";
import { getPixiApp } from "./pixi-application";

export type PixiCanvasProps = {
  children: JSX.Element;
  style?: JSX.CSSProperties | undefined;
  className?: string;
};

/**
 * PixiCanvas
 *
 * A small wrapper that mounts the PIXI application's canvas element into the DOM
 * and automatically resizes it.
 *
 * - Requires a surrounding `PixiApplication` component.
 * - Accepts pixi-solid components as children, which will be rendered inside the canvas.
 *
 * Props:
 * @param props.children - JSX content to render inside the canvas wrapper.
 */

export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  let canvasWrapElement: HTMLDivElement | undefined;

  const pixiApp = getPixiApp();
  pixiApp.canvas.style.display = "block";
  pixiApp.canvas.style.position = "absolute";
  pixiApp.canvas.style.top = "0";
  pixiApp.canvas.style.left = "0";
  pixiApp.canvas.style.width = "100%";
  pixiApp.canvas.style.height = "100%";

  applyProps(pixiApp.stage, props);

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
        position: "relative",
        /* Disables the callout/menu on long-press */
        ["-webkit-touch-callout"]: "none",
        /* Disables text selection */
        ["-webkit-user-select"]: "none",
        ["user-select"]: "none",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
      class={props.className}
    >
      {pixiApp.canvas}
    </div>
  );
};
