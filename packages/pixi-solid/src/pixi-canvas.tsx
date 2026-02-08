import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";
import { onCleanup, onMount, splitProps } from "solid-js";
import { applyProps } from "./component-creation";
import { getPixiApp, PixiApplicationProvider } from "./pixi-application";

export type PixiCanvasProps = {
  children: JSX.Element;
  style?: JSX.CSSProperties | undefined;
  class?: string;
} & Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

const InnerPixiCanvas = (props: Pick<PixiCanvasProps, "children" | "style" | "class">): JSX.Element => {
  let canvasWrapElement: HTMLDivElement | undefined;

  const pixiApp = getPixiApp();

  if (!pixiApp) {
    throw new Error(
      "PixiCanvas must be used within a PixiApplicationProvider or with an existing Pixi Application context.",
    );
  }

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
      class={props.class}
    >
      {pixiApp.canvas}
    </div>
  );
};

/**
 * PixiCanvas
 *
 * A small wrapper that mounts the PIXI application's canvas element into the DOM
 * and automatically resizes it.
 *
 * - Works with or without a surrounding `PixiApplicationProvider` component.
 * - If used inside `PixiApplicationProvider`, it will use the provided context.
 * - If used standalone, it will create its own PixiApplication and provide context.
 * - Accepts pixi-solid components as children, which will be rendered inside the canvas.
 *
 * Props:
 * @param props.children - JSX content to render inside the canvas wrapper.
 * @param props.style - CSS styles to apply to the canvas wrapper.
 * @param props.class - CSS class to apply to the canvas wrapper.
 * @param props - Additional Pixi ApplicationOptions (except 'children' and 'resizeTo').
 */

export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  const [, applicationOptions] = splitProps(props, ["children", "style", "class"]);
  return (
    <PixiApplicationProvider {...applicationOptions}>
      <InnerPixiCanvas style={props.style} class={props.class}>
        {props.children}
      </InnerPixiCanvas>
    </PixiApplicationProvider>
  );
};
