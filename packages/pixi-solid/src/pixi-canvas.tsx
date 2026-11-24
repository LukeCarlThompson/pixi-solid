import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import type { Ref } from "solid-js";
import { createMemo, omit, onCleanup, onSettled } from "solid-js";

import { applyRef } from "./apply-ref";
import { bindRuntimeProps } from "./components";
import type { ContainerProps } from "./components/factories";
import { getPixiApp, PixiApplicationProvider } from "./pixi-application";

/**
 * Props for `PixiCanvas`.
 *
 * Accepts Pixi application initialization options, plus Solid's `class`, `style`, and `ref`
 * props for its internal wrapper. `class` accepts a `JSX.ClassValue`, so an object or array
 * can be used in place of the Solid 1 `classList` prop. Other DOM attributes belong on a
 * caller-owned parent element.
 */
export type PixiCanvasProps = {
  children: JSX.Element;
  class?: JSX.ClassValue;
  ref?: Ref<HTMLDivElement>;
  style?: JSX.HTMLAttributes<HTMLDivElement>["style"];
} & Partial<Omit<Pixi.ApplicationOptions, "children" | "resizeTo">>;

type PixiCanvasWrapperProps = Pick<PixiCanvasProps, "class" | "ref" | "style">;

const WRAPPER_KEYS = new Set(["class", "ref", "style"]);

const splitPixiCanvasProps = (props: PixiCanvasProps) => {
  const applicationOptions = omit(props, "children", "class", "ref", "style");
  const wrapperProps = omit(
    props,
    (key) => typeof key !== "string" || !WRAPPER_KEYS.has(key),
  ) as PixiCanvasWrapperProps;

  return {
    applicationOptions: applicationOptions as Partial<
      Omit<Pixi.ApplicationOptions, "children" | "resizeTo">
    >,
    wrapperProps,
  };
};

const applicationsWithCanvas = new WeakSet<Pixi.Application>();

const claimCanvasMount = (app: Pixi.Application): (() => void) => {
  if (applicationsWithCanvas.has(app)) {
    throw new Error(
      "Only one PixiCanvas may be mounted at a time per Pixi.Application. Unmount it before mounting another.",
    );
  }

  applicationsWithCanvas.add(app);
  return () => {
    applicationsWithCanvas.delete(app);
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

  const releaseCanvasMount = claimCanvasMount(pixiApp);
  onCleanup(releaseCanvasMount);

  bindRuntimeProps(pixiApp.stage, {
    children: props.children,
  } as ContainerProps<Pixi.Container>);

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

  onSettled(() => {
    if (!canvasWrapElement) return;

    const previousResizeTo = pixiApp.resizeTo;
    const resizeObserver = new ResizeObserver(() => {
      pixiApp.queueResize();
    });

    pixiApp.resizeTo = canvasWrapElement;
    pixiApp.queueResize();
    resizeObserver.observe(canvasWrapElement);

    return () => {
      pixiApp.resizeTo = previousResizeTo;
      resizeObserver.disconnect();
    };
  });

  return (
    <div
      class={props.wrapperProps?.class}
      ref={(el) => {
        canvasWrapElement = el;
        applyRef(props.wrapperProps?.ref, el);
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
 * Accepts `class`, `style`, and `ref` for the wrapper, plus `Pixi.ApplicationOptions`
 * for application initialization. Only one `PixiCanvas` can be mounted at a time per app; it may be remounted after unmount.
 */
export const PixiCanvas = (props: PixiCanvasProps): JSX.Element => {
  const { applicationOptions, wrapperProps } = splitPixiCanvasProps(props);
  return (
    <PixiApplicationProvider {...applicationOptions}>
      <InnerPixiCanvas wrapperProps={wrapperProps}>{props.children}</InnerPixiCanvas>
    </PixiApplicationProvider>
  );
};
