import { onCleanup, onMount } from "solid-js";

import type { JSX } from "solid-js";
import { usePixiApp } from "./pixi-app-context";
import { insert } from "./runtime";

export const PixiCanvas = (props: { children: JSX.Element }): JSX.Element => {
  let canvasWrapElement: HTMLDivElement | undefined;

  const pixiApp = usePixiApp();
  pixiApp.canvas.style.display = "block";

  insert(pixiApp.stage, () => props.children);

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
    <div ref={canvasWrapElement} style={{ width: "100%", height: "100%", display: "block" }}>
      {pixiApp.canvas}
    </div>
  );
};
