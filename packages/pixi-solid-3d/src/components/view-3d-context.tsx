import type * as Pixi3D from "@pixi/3d";
import type { Accessor, JSX, ParentProps } from "solid-js";
import { createContext, createSignal, useContext } from "solid-js";

export type View3DRegistration = {
  registerView: (view: Pixi3D.View3D) => void;
  unregisterView: (view: Pixi3D.View3D) => void;
};

export type View3DContextValue<TRoot extends Pixi3D.Container3D = Pixi3D.Container3D> = {
  view: Accessor<Pixi3D.View3D<TRoot> | undefined>;
  registration?: View3DRegistration;
};

export const View3DContext = createContext<View3DContextValue>();

/**
 * A SolidJS hook that provides access to the enclosing View3D instance.
 * Must be used within a `<View3D>` or `<View3DProvider>`.
 */
export const useView3D = <
  TRoot extends Pixi3D.Container3D = Pixi3D.Container3D,
>(): Pixi3D.View3D<TRoot> => {
  const context = useContext(View3DContext);
  const viewInstance = context?.view();
  if (!context || !viewInstance) {
    throw new Error(
      "useView3D must be used within a <View3D>, <View3DProvider>, or a component mounted inside one.",
    );
  }
  return viewInstance as Pixi3D.View3D<TRoot>;
};

/**
 * A SolidJS hook that optionally returns the enclosing View3D instance, or undefined if not mounted.
 */
export const useOptionalView3D = <TRoot extends Pixi3D.Container3D = Pixi3D.Container3D>():
  | Pixi3D.View3D<TRoot>
  | undefined => {
  const context = useContext(View3DContext);
  return context?.view() as Pixi3D.View3D<TRoot> | undefined;
};

/**
 * Provides a scoped View3D context to both a `<View3D>` viewport and its sibling 2D components.
 *
 * Enforces a strict one-to-one relationship: exactly one `<View3D>` may be mounted within
 * a single `<View3DProvider>`. For multiple viewports (e.g. split-screen or minimap PIP),
 * wrap each viewport in its own `<View3DProvider>`.
 */
export const View3DProvider = (props: ParentProps): JSX.Element => {
  const [currentView, setCurrentView] = createSignal<Pixi3D.View3D | undefined>(undefined);

  const registration: View3DRegistration = {
    registerView: (view: Pixi3D.View3D) => {
      const existing = currentView();
      if (existing && existing !== view && !existing.destroyed) {
        throw new Error(
          "Multiple <View3D> components detected inside a single <View3DProvider>. Each 3D viewport and its associated 2D overlays must be wrapped in its own <View3DProvider>.",
        );
      }
      setCurrentView(view);
    },
    unregisterView: (view: Pixi3D.View3D) => {
      if (currentView() === view) {
        setCurrentView(undefined);
      }
    },
  };

  return (
    <View3DContext.Provider
      value={{
        view: currentView,
        registration,
      }}
    >
      {props.children}
    </View3DContext.Provider>
  );
};
