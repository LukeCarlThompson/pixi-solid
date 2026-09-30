import type * as Pixi3D from "@pixi/3d";
import {
  CapsuleGeometry as PixiCapsuleGeometry,
  ConeGeometry as PixiConeGeometry,
  CubeGeometry as PixiCubeGeometry,
  CylinderGeometry as PixiCylinderGeometry,
  FlatMaterial as PixiFlatMaterial,
  IcosahedronGeometry as PixiIcosahedronGeometry,
  Material3D as PixiMaterial3D,
  ParticleMaterial as PixiParticleMaterial,
  PhongMaterial as PixiPhongMaterial,
  PlaneGeometry as PixiPlaneGeometry,
  SphereGeometry as PixiSphereGeometry,
  TorusGeometry as PixiTorusGeometry,
  TorusKnotGeometry as PixiTorusKnotGeometry,
} from "@pixi/3d";
import { createRenderEffect, on, onCleanup, splitProps, type Component, type Ref } from "solid-js";

import { useMesh3D } from "./mesh-3d-context";

export type ResourceRefProps<T> = {
  ref?: Ref<T>;
  as?: T;
};

/**
 * Factory helper for creating declarative, lifecycle-managed Geometry3D components.
 * Automatically attaches to the enclosing <Mesh3D> and destroys the geometry on unmount.
 */
export const createGeometry3DComponent = <
  TInstance extends Pixi3D.Geometry3D,
  TOptions extends Record<string, any>,
>(
  GeometryClass: new (options?: any) => TInstance,
): Component<TOptions & ResourceRefProps<TInstance>> => {
  return (props) => {
    const meshCtx = useMesh3D();
    const [local, initialisationProps] = splitProps(props, ["ref", "as"]);

    const isUserOwned = local.as !== undefined;
    const geometry = local.as || new GeometryClass(initialisationProps);

    createRenderEffect(() => {
      if (local.ref) {
        (local.ref as unknown as (g: TInstance) => void)(geometry);
      }
    });

    meshCtx.registerGeometry(geometry);

    onCleanup(() => {
      meshCtx.unregisterGeometry(geometry);
      if (!isUserOwned) {
        geometry.destroy();
      }
    });

    return null;
  };
};

/**
 * Factory helper for creating declarative, lifecycle-managed Material3D components.
 * Automatically attaches to the enclosing <Mesh3D>, applies fine-grained reactive updates
 * directly to material setters, and destroys the material on unmount.
 */
export const createMaterial3DComponent = <
  TInstance extends Pixi3D.BaseMaterial3D,
  TOptions extends Record<string, any>,
>(
  MaterialClass: new (options?: any) => TInstance,
): Component<TOptions & ResourceRefProps<TInstance>> => {
  return (props) => {
    const meshCtx = useMesh3D();
    const [local, initialisationProps] = splitProps(props, ["ref", "as"]);

    const isUserOwned = local.as !== undefined;
    const material = local.as || new MaterialClass(initialisationProps);

    createRenderEffect(() => {
      if (local.ref) {
        (local.ref as unknown as (m: TInstance) => void)(material);
      }
    });

    // Reactive setters for fine-grained runtime updates
    for (const key in initialisationProps) {
      createRenderEffect(
        on(
          () => (props as any)[key],
          (nextVal) => {
            if (nextVal !== undefined && key in material) {
              (material as any)[key] = nextVal;
            }
          },
          { defer: true },
        ),
      );
    }

    meshCtx.registerMaterial(material);

    onCleanup(() => {
      meshCtx.unregisterMaterial(material);
      if (!isUserOwned) {
        material.destroy();
      }
    });

    return null;
  };
};

// Declarative Geometry Components
export const CubeGeometry: Component<
  Partial<Pixi3D.CubeGeometryOptions> & ResourceRefProps<PixiCubeGeometry>
> = createGeometry3DComponent<PixiCubeGeometry, Partial<Pixi3D.CubeGeometryOptions>>(
  PixiCubeGeometry,
);

export const SphereGeometry: Component<
  Partial<Pixi3D.SphereGeometryOptions> & ResourceRefProps<PixiSphereGeometry>
> = createGeometry3DComponent<PixiSphereGeometry, Partial<Pixi3D.SphereGeometryOptions>>(
  PixiSphereGeometry,
);

export const PlaneGeometry: Component<
  Partial<Pixi3D.PlaneGeometryOptions> & ResourceRefProps<PixiPlaneGeometry>
> = createGeometry3DComponent<PixiPlaneGeometry, Partial<Pixi3D.PlaneGeometryOptions>>(
  PixiPlaneGeometry,
);

export const CylinderGeometry: Component<
  Partial<Pixi3D.CylinderGeometryOptions> & ResourceRefProps<PixiCylinderGeometry>
> = createGeometry3DComponent<PixiCylinderGeometry, Partial<Pixi3D.CylinderGeometryOptions>>(
  PixiCylinderGeometry,
);

export const ConeGeometry: Component<
  Partial<Pixi3D.ConeGeometryOptions> & ResourceRefProps<PixiConeGeometry>
> = createGeometry3DComponent<PixiConeGeometry, Partial<Pixi3D.ConeGeometryOptions>>(
  PixiConeGeometry,
);

export const CapsuleGeometry: Component<
  Partial<Pixi3D.CapsuleGeometryOptions> & ResourceRefProps<PixiCapsuleGeometry>
> = createGeometry3DComponent<PixiCapsuleGeometry, Partial<Pixi3D.CapsuleGeometryOptions>>(
  PixiCapsuleGeometry,
);

export const TorusGeometry: Component<
  Partial<Pixi3D.TorusGeometryOptions> & ResourceRefProps<PixiTorusGeometry>
> = createGeometry3DComponent<PixiTorusGeometry, Partial<Pixi3D.TorusGeometryOptions>>(
  PixiTorusGeometry,
);

export const TorusKnotGeometry: Component<
  Partial<Pixi3D.TorusKnotGeometryOptions> & ResourceRefProps<PixiTorusKnotGeometry>
> = createGeometry3DComponent<PixiTorusKnotGeometry, Partial<Pixi3D.TorusKnotGeometryOptions>>(
  PixiTorusKnotGeometry,
);

export const IcosahedronGeometry: Component<
  Partial<Pixi3D.IcosahedronGeometryOptions> & ResourceRefProps<PixiIcosahedronGeometry>
> = createGeometry3DComponent<PixiIcosahedronGeometry, Partial<Pixi3D.IcosahedronGeometryOptions>>(
  PixiIcosahedronGeometry,
);

// Declarative Material Components
export const Material3D: Component<
  Partial<Pixi3D.Material3DOptions> & ResourceRefProps<PixiMaterial3D>
> = createMaterial3DComponent<PixiMaterial3D, Partial<Pixi3D.Material3DOptions>>(PixiMaterial3D);

export const FlatMaterial: Component<
  Partial<Pixi3D.FlatMaterialOptions> & ResourceRefProps<PixiFlatMaterial>
> = createMaterial3DComponent<PixiFlatMaterial, Partial<Pixi3D.FlatMaterialOptions>>(
  PixiFlatMaterial,
);

export const PhongMaterial: Component<
  Partial<Pixi3D.PhongMaterialOptions> & ResourceRefProps<PixiPhongMaterial>
> = createMaterial3DComponent<PixiPhongMaterial, Partial<Pixi3D.PhongMaterialOptions>>(
  PixiPhongMaterial,
);

export const ParticleMaterial: Component<
  Partial<Pixi3D.ParticleMaterialOptions> & ResourceRefProps<PixiParticleMaterial>
> = createMaterial3DComponent<PixiParticleMaterial, Partial<Pixi3D.ParticleMaterialOptions>>(
  PixiParticleMaterial,
);
