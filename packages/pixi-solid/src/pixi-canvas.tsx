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

/**
 * Props for the `PixiCanvas` component.
 *
 * Accepts any HTML div attribute (class, style, event listeners, etc.)
 * plus `Pixi.ApplicationOptions` (except `children` and `resizeTo`,
 * which are handled internally).
 */
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
 * Mounts the PixiJS application canvas into the DOM with automatic resize.
 *
 * Can be used standalone (creates its own `PixiApplication`) or nested inside
 * `PixiApplicationProvider` (uses the existing context). Accepts pixi-solid
 * components as children, which are rendered into the canvas scene graph.
 *
 * Accepts HTML div attributes (`class`, `style`, `id`, event listeners, etc.)
 * on the wrapper element, plus `Pixi.ApplicationOptions` for the canvas init.
 */

export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  const { applicationOptions, wrapperProps } = splitPixiCanvasProps(props);
  return (
    <PixiApplicationProvider {...applicationOptions}>
      <InnerPixiCanvas wrapperProps={wrapperProps}>{props.children}</InnerPixiCanvas>
    </PixiApplicationProvider>
  );
};
