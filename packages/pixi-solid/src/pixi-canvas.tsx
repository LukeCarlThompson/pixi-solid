import type * as Pixi from "pixi.js";
import type { JSX } from "solid-js";
import { createMemo, onCleanup, onMount, splitProps } from "solid-js";

import { bindRuntimeProps } from "./components";
import type { ContainerProps } from "./components/factories";
import { getPixiApp, PixiApplicationProvider } from "./pixi-application";

/**
 * Props for `PixiCanvas`.
 *
 * Accepts Pixi application initialization options, plus `class`, `classList`, `style`, and `ref`
 * for its internal wrapper. Other DOM attributes belong on a caller-owned parent element.
 */
export type PixiCanvasProps = {
  children: JSX.Element;
  class?: string;
  classList?: JSX.HTMLAttributes<HTMLDivElement>["classList"];
  ref?: (el: HTMLDivElement) => void;
  style?: JSX.HTMLAttributes<HTMLDivElement>["style"];
} & Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

type PixiCanvasWrapperProps = Pick<PixiCanvasProps, "class" | "classList" | "ref" | "style">;

const splitPixiCanvasProps = (props: PixiCanvasProps) => {
  const [, wrapperProps, applicationOptions] = splitProps(
    props,
    ["children"],
    ["class", "classList", "ref", "style"],
  );

  return {
    applicationOptions: applicationOptions as Partial<
      Omit<Pixi.ApplicationOptions, "children" | "resizeTo">
    >,
    wrapperProps: wrapperProps as PixiCanvasWrapperProps,
  };
};

const InnerPixiCanvas = (props: {
  children: JSX.Element;
  wrapperProps?: PixiCanvasWrapperProps;
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
  const wrapperStyle = createMemo<JSX.HTMLAttributes<HTMLDivElement>["style"]>(() => {
    const style = props.wrapperProps?.style;

    if (typeof style === "string") {
      return `position: relative; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; ${style}`;
    }

    return {
      position: "relative",
      ["-webkit-touch-callout"]: "none",
      ["-webkit-user-select"]: "none",
      ["user-select"]: "none",
      ...style,
    } as JSX.CSSProperties;
  });

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
      style={wrapperStyle()}
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
 * Accepts `class`, `classList`, `style`, and `ref` for the wrapper, plus `Pixi.ApplicationOptions`
 * for application initialization.
 */

export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  const { applicationOptions, wrapperProps } = splitPixiCanvasProps(props);
  return (
    <PixiApplicationProvider {...applicationOptions}>
      <InnerPixiCanvas wrapperProps={wrapperProps}>{props.children}</InnerPixiCanvas>
    </PixiApplicationProvider>
  );
};
