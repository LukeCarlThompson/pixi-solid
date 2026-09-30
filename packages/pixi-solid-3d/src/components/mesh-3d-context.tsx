import type * as Pixi3D from "@pixi/3d";
import { createContext, useContext } from "solid-js";

export type Mesh3DContextValue = {
  mesh: Pixi3D.Mesh3D;
  registerGeometry: (geometry: Pixi3D.Geometry3D) => void;
  unregisterGeometry: (geometry: Pixi3D.Geometry3D) => void;
  registerMaterial: (material: Pixi3D.BaseMaterial3D) => void;
  unregisterMaterial: (material: Pixi3D.BaseMaterial3D) => void;
};

export const Mesh3DContext = createContext<Mesh3DContextValue>();

/**
 * Access the parent Mesh3D context, or throw if mounted outside a `<Mesh3D>`.
 */
export const useMesh3D = (): Mesh3DContextValue => {
  const context = useContext(Mesh3DContext);
  if (!context) {
    throw new Error(
      "useMesh3D must be used within a <Mesh3D> component or one of its child resources.",
    );
  }
  return context;
};
