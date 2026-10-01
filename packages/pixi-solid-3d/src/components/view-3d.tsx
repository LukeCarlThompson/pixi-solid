import type * as Pixi3D from "@pixi/3d";
import { View3D as PixiView3D } from "@pixi/3d";
import {
  createRenderEffect,
  DEV,
  onCleanup,
  splitProps,
  useContext,
  type Component,
  type JSX,
  type Ref,
} from "solid-js";

import { bindChildrenToContainer3D } from "./bind-children";
import { View3DContext } from "./view-3d-context";

export type View3DProps<TRoot extends Pixi3D.Container3D = Pixi3D.Container3D> =
  Pixi3D.View3DOptions<TRoot> & {
    children?: JSX.Element;
    ref?: Ref<Pixi3D.View3D<TRoot>>;
    as?: Pixi3D.View3D<TRoot>;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    autoResize?: boolean;
  };

const VIEW_3D_RUNTIME_KEYS = ["ref", "as", "children"] as const;

const viewsWithMount = new WeakSet<Pixi3D.View3D>();

const claimView3DMount = (view: Pixi3D.View3D): (() => void) => {
  if (viewsWithMount.has(view)) {
    throw new Error(
      "Only one <View3D> may be mounted at a time per View3D instance. Unmount it before mounting another.",
    );
  }

  viewsWithMount.add(view);
  return () => {
    viewsWithMount.delete(view);
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
export const View3D: Component<View3DProps> = (props) => {
  const [local, initialisationProps] = splitProps(props, VIEW_3D_RUNTIME_KEYS);

  const parentView = useContext(View3DContext);

  if (local.as !== undefined && parentView !== undefined) {
    throw new Error(
      "<View3D> cannot combine the `as` prop with an enclosing <View3DProvider>. Pass `as` to the <View3DProvider> instead so sibling 2D components resolve the same View3D.",
    );
  }

  const isUserOwnedInstance = local.as !== undefined;
  const isProviderOwnedInstance = parentView !== undefined;
  const view = local.as || parentView || new PixiView3D(initialisationProps);

  if (isProviderOwnedInstance) {
    warnAboutIgnoredOptions(initialisationProps as unknown as Record<string, unknown>);
  } else {
    createRenderEffect(() => {
      for (const key in initialisationProps) {
        const value = (props as unknown as Record<string, unknown>)[key];
        if (value !== undefined && key in view) {
          (view as unknown as Record<string, unknown>)[key] = value;
        }
      }
    });
  }

  const releaseMount = claimView3DMount(view);
  onCleanup(releaseMount);

  createRenderEffect(() => {
    if (local.ref) {
      (local.ref as unknown as (instance: Pixi3D.View3D) => void)(view);
    }
  });

  onCleanup(() => {
    if (isUserOwnedInstance || isProviderOwnedInstance) return;
    view.destroy({ children: true });
  });

  return (
    <View3DContext.Provider value={view}>
      {(() => {
        // Bind children inside the context provider so useContext(View3DContext) resolves!
        bindChildrenToContainer3D(view.root, local.children);
        return view as unknown as JSX.Element;
      })()}
    </View3DContext.Provider>
  );
};
