import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";

import { bindRuntimeProps } from "./components";
import type { ContainerProps } from "./components";
import { getPixiApp, PixiApplicationProvider } from "./pixi-application";

// Helper type to remove colon event handlers from JSX attributes
type OmitColonEvents<T> = {
  [K in keyof T as K extends `on:${string}` ? never : K]: T[K];
};

export type PixiCanvasProps = {
  children: JSX.Element;
  ref?: (el: HTMLDivElement) => void;
} & OmitColonEvents<Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">> &
  Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

const isDomPropKey = (key: string): boolean => {
  if (key === "class" || key === "classList" || key === "style") return true;
  if (key === "id" || key === "title" || key === "role" || key === "tabIndex") return true;
  if (key.startsWith("aria-") || key.startsWith("data-")) return true;
  if (/^on[A-Z]/.test(key)) return true;

  return false;
};

const splitPixiCanvasProps = (props: PixiCanvasProps) => {
  const wrapperProps: JSX.HTMLAttributes<HTMLDivElement> = {};
  const applicationOptions: Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">> = {};

  for (const key in props) {
    if (key === "children") continue;
    const value = props[key as keyof PixiCanvasProps];

    if (key === "ref" || isDomPropKey(key)) {
      (wrapperProps as Record<string, unknown>)[key] = value;
    } else {
      (applicationOptions as Record<string, unknown>)[key] = value;
    }
  }

  return { applicationOptions, wrapperProps };
};

const InnerPixiCanvas = (props: {
  children: JSX.Element;
  wrapperProps?: JSX.HTMLAttributes<HTMLDivElement>;
}): JSX.Element => {
  let canvasWrapElement: HTMLDivElement | undefined;
  let pixiApp: Pixi.Application;

  try {
    pixiApp = getPixiApp();
  } catch {
    throw new Error(
      "InnerPixiCanvas must be used within a PixiApplicationProvider or a PixiCanvas",
    );
  }

  bindRuntimeProps(pixiApp.stage, {
    children: props.children,
  } as ContainerProps<Pixi.Container>);

  let previousResizeTo: HTMLElement | Window;
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
      {...props.wrapperProps}
      ref={(el) => {
        canvasWrapElement = el;
        const userRef = props.wrapperProps?.ref;
        if (typeof userRef === "function") {
          userRef(el);
        }
      }}
      style={{
        position: "relative",
        /* Disables the callout/menu on long-press */
        ["-webkit-touch-callout"]: "none",
        /* Disables text selection */
        ["-webkit-user-select"]: "none",
        ["user-select"]: "none",
        ...(typeof props.wrapperProps?.style === "object" ? props.wrapperProps.style : {}),
      }}
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
 * @param props - DOM props for the wrapper and Pixi ApplicationOptions (except 'children' and 'resizeTo').
 */

export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  const { applicationOptions, wrapperProps } = splitPixiCanvasProps(props);
  return (
    <PixiApplicationProvider {...applicationOptions}>
      <InnerPixiCanvas wrapperProps={wrapperProps}>{props.children}</InnerPixiCanvas>
    </PixiApplicationProvider>
  );
};
