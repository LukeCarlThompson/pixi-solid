import type * as Pixi3D from "@pixi/3d";
import { View3D } from "@pixi/3d";
import {
  createRenderEffect,
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

/**
 * A SolidJS component representing a 3D Viewport (`View3D`) in the PixiJS 2D scene graph.
 *
 * Children of `<View3D>` are mounted into its 3D root (`view.root`).
 * Provides `View3DContext` so children or custom hooks can access the `View3D` instance.
 */
export const View3DComponent: Component<View3DProps> = (props) => {
  const [local, initialisationProps] = splitProps(props, VIEW_3D_RUNTIME_KEYS);

  const isUserOwnedInstance = local.as !== undefined;
  const view = local.as || new View3D(initialisationProps);

  // Register with parent View3DProvider if present
  const parentContext = useContext(View3DContext);
  if (parentContext?.registration) {
    parentContext.registration.registerView(view);
    onCleanup(() => {
      parentContext.registration?.unregisterView(view);
    });
  }

  createRenderEffect(() => {
    if (local.ref) {
      (local.ref as unknown as (v: Pixi3D.View3D) => void)(view);
    }
  });

  createRenderEffect(() => {
    for (const key in initialisationProps) {
      const val = (props as any)[key];
      if (val !== undefined && key in view) {
        (view as any)[key] = val;
      }
    }
  });

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    view.destroy({ children: true });
  });

  return (
    <View3DContext.Provider value={{ view: () => view }}>
      {(() => {
        // Bind children inside the context provider so useContext(View3DContext) resolves!
        bindChildrenToContainer3D(view.root, local.children);
        return view as unknown as JSX.Element;
      })()}
    </View3DContext.Provider>
  );
};
