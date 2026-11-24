import type * as Pixi3D from "@pixi/3d";
import { View3D as PixiView3D } from "@pixi/3d";
import type { JSX } from "@solidjs/web";
import {
  children as resolveChildren,
  createRenderEffect,
  DEV,
  omit,
  onCleanup,
  untrack,
  useContext,
} from "solid-js";
import type { Component, Ref } from "solid-js";

import { applyRef } from "../apply-ref";

import { bindChildrenToContainer3D } from "./bind-children";
import { VIEW_3D_CONSTRUCTION_ONLY_KEYS, View3DContext } from "./view-3d-context";

/**
 * `root` is deliberately absent. A view mounts the camera and any unparented lights under its root,
 * so passing a model as the root also parents the camera under that model and inherits its
 * transform; `@pixi/3d` also only tracks the root a view was built with, so it cannot be replaced
 * later. Build the view yourself and hand it over with `as` if you need a custom root.
 */
export type View3DProps<TRoot extends Pixi3D.Container3D = Pixi3D.Container3D> = Omit<
  Pixi3D.View3DOptions<TRoot>,
  "root"
> & {
  children?: JSX.Element;
  ref?: Ref<Pixi3D.View3D<TRoot>>;
  as?: Pixi3D.View3D<TRoot>;
};

const VIEW_3D_RUNTIME_KEYS = ["ref", "as", "children"] as const;

const mountedViews = new WeakSet<Pixi3D.View3D>();

const claimView3DMount = (view: Pixi3D.View3D): (() => void) => {
  if (mountedViews.has(view)) {
    throw new Error(
      "Only one <View3D> may be mounted at a time per View3D instance. Unmount it before mounting another.",
    );
  }

  mountedViews.add(view);
  return () => {
    mountedViews.delete(view);
  };
};

const warnAboutIgnoredOptions = (options: Record<string, unknown>): void => {
  if (!DEV) return;

  const ignoredKeys = Object.keys(options).filter((key) => options[key] !== undefined);
  if (ignoredKeys.length === 0) return;

  console.warn(
    `[pixi-solid-3d] <View3D> options were ignored because this View3D is owned by an enclosing <View3DProvider>. Pass them to <View3DProvider> instead. Ignored: ${ignoredKeys.join(", ")}.`,
  );
};

/**
 * A SolidJS component that mounts a 3D viewport (`View3D`) into the PixiJS 2D scene graph.
 *
 * Children of `<View3D>` are mounted into its 3D root (`view.root`).
 *
 * The viewport instance is resolved in this order:
 *
 * 1. `as` — a `View3D` you created yourself. Never destroyed by this component.
 * 2. The nearest enclosing `<View3DProvider>` — the provider owns the instance, so this component
 *    only mounts it and its own `View3DOptions` are ignored (a DEV warning is logged).
 * 3. Otherwise a new `View3D` is created from the props and destroyed on cleanup.
 *
 * Use `<View3DProvider>` when 2D components must sit beside the viewport and share the same
 * `View3D`. On its own, `<View3D>` owns its viewport and shares it with its 3D children.
 */
export const View3D: Component<View3DProps> = (props) =>
  // The body is one-time setup: create the view, sync options, claim the mount and bind children.
  // Run it under `untrack`; the effects created inside keep their own tracking.
  untrack(() => {
    // A missing provider reads as `null`, which is not `undefined`: normalise it so the
    // ownership checks below stay a plain `!== undefined` test.
    const parentView = useContext(View3DContext) ?? undefined;

    if (props.as !== undefined && parentView !== undefined) {
      throw new Error(
        "<View3D> cannot combine the `as` prop with an enclosing <View3DProvider>. Pass `as` to the <View3DProvider> instead so sibling 2D components resolve the same View3D.",
      );
    }

    const isUserOwnedInstance = props.as !== undefined;
    const isProviderOwnedInstance = parentView !== undefined;
    const initialisationProps = { ...omit(props, ...VIEW_3D_RUNTIME_KEYS) };
    const view = props.as || parentView || new PixiView3D(initialisationProps);

    if (isProviderOwnedInstance) {
      warnAboutIgnoredOptions(initialisationProps as Record<string, unknown>);
    } else {
      // One effect per option, so a change writes only that option. Same shape as the prop binders.
      for (const key in initialisationProps) {
        if (VIEW_3D_CONSTRUCTION_ONLY_KEYS.has(key)) continue;
        createRenderEffect(
          () => (props as unknown as Record<string, unknown>)[key],
          (value) => {
            if (value !== undefined && key in view) {
              (view as unknown as Record<string, unknown>)[key] = value;
            }
          },
        );
      }
    }

    onCleanup(claimView3DMount(view));

    createRenderEffect(
      () => props.ref,
      (ref) => applyRef(ref, view),
    );

    onCleanup(() => {
      if (isUserOwnedInstance || isProviderOwnedInstance) return;
      view.destroy({ children: true });
    });

    return (
      <View3DContext value={view}>
        {(() => {
          // Mount the children during render, inside the context provider, so a sibling 2D
          // component that reads the view on its first render already sees the camera they set up.
          const resolved = resolveChildren(() => props.children);
          resolved();
          bindChildrenToContainer3D(view.root, () => props.children);
          return view as unknown as JSX.Element;
        })()}
      </View3DContext>
    );
  });
