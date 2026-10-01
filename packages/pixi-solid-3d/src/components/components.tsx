import type * as Pixi3D from "@pixi/3d";
import {
  AmbientLight as PixiAmbientLight,
  BatchedMesh3D as PixiBatchedMesh3D,
  Camera3D as PixiCamera3D,
  Container3D as PixiContainer3D,
  DirectionalLight as PixiDirectionalLight,
  FlatMaterial as PixiFlatMaterial,
  Mesh3D as PixiMesh3D,
  Model3D as PixiModel3D,
  ParticleContainer3D as PixiParticleContainer3D,
  PlaneGeometry as PixiPlaneGeometry,
  PointLight as PixiPointLight,
  SpotLight as PixiSpotLight,
  Sprite3D as PixiSprite3D,
} from "@pixi/3d";
import { getTicker } from "pixi-solid";
import type { Ticker } from "pixi.js";
import {
  children as resolveChildren,
  createRenderEffect,
  on,
  onCleanup,
  splitProps,
  type JSX,
} from "solid-js";

import { bindInitialisationProps3D, bindRuntimeProps3D } from "./bind-props";
import {
  CONTAINER3D_RUNTIME_KEYS,
  createContainer3DComponent,
  createLeaf3DComponent,
  LEAF3D_RUNTIME_KEYS,
  type Container3DProps,
  type Leaf3DProps,
  type PixiComponent3D,
} from "./factories";

export type { Container3DProps, Leaf3DProps, PixiComponent3D };

export type Container3DComponentProps = Container3DProps<PixiContainer3D> &
  Omit<Pixi3D.Container3DOptions, "children">;
export type Mesh3DComponentProps = Leaf3DProps<PixiMesh3D> &
  Omit<Partial<Pixi3D.Mesh3DOptions>, "children"> & {
    children?: JSX.Element;
  };
export type Model3DComponentProps = Container3DProps<PixiModel3D> &
  Omit<Pixi3D.Model3DOptions, "children"> & {
    traverse?: (node: Pixi3D.Container3D) => void;
  };
export type Sprite3DComponentProps = Leaf3DProps<PixiSprite3D> &
  Omit<Pixi3D.Sprite3DOptions, "children">;

import { traverse3D } from "../utils/traverse-3d";

import { Mesh3DContext } from "./mesh-3d-context";
import { useView3D } from "./view-3d-context";

export type Camera3DComponentProps = Leaf3DProps<PixiCamera3D> &
  Omit<Pixi3D.Camera3DOptions, "children"> & {
    active?: boolean;
  };
export type AmbientLightComponentProps = Leaf3DProps<PixiAmbientLight> &
  Omit<Pixi3D.AmbientLightOptions, "children">;
export type DirectionalLightComponentProps = Leaf3DProps<PixiDirectionalLight> &
  Omit<Pixi3D.DirectionalLightOptions, "children">;
export type PointLightComponentProps = Leaf3DProps<PixiPointLight> &
  Omit<Pixi3D.PointLightOptions, "children">;
export type SpotLightComponentProps = Leaf3DProps<PixiSpotLight> &
  Omit<Pixi3D.SpotLightOptions, "children">;
export type BatchedMesh3DComponentProps = Leaf3DProps<PixiBatchedMesh3D> &
  Omit<Pixi3D.BatchedMesh3DOptions, "children">;
export type ParticleContainer3DComponentProps = Leaf3DProps<PixiParticleContainer3D> &
  Omit<Pixi3D.ParticleContainer3DOptions, "children">;

/**
 * A SolidJS component that renders a `Container3D`.
 */
export const Container3D: PixiComponent3D<Container3DComponentProps, PixiContainer3D> =
  createContainer3DComponent<PixiContainer3D, Pixi3D.Container3DOptions>(PixiContainer3D);

/**
 * A SolidJS component that renders a `Mesh3D`.
 * Supports passing `geometry` and `material` as props, or declaring them as nested
 * children (e.g. `<Mesh3D><CubeGeometry /><Material3D /></Mesh3D>`), which manages their lifecycle
 * and automatically disposes them when unmounted.
 */
export const Mesh3D: PixiComponent3D<Mesh3DComponentProps, PixiMesh3D> = (props) => {
  const [runtimeProps, initialisationProps] = splitProps(props, [
    ...LEAF3D_RUNTIME_KEYS,
    "children",
  ]);

  const isUserOwnedInstance = runtimeProps.as !== undefined;
  const initialisation = { ...initialisationProps } as any;
  if (!initialisation.geometry) {
    initialisation.geometry = new PixiPlaneGeometry();
  }
  if (!initialisation.material) {
    initialisation.material = new PixiFlatMaterial();
  }
  const instance = props.as || new PixiMesh3D(initialisation);

  const initialGeometry = instance.geometry;
  const initialMaterial = instance.material;

  const registerGeometry = (geometry: any) => {
    instance.geometry = geometry;
  };
  const unregisterGeometry = (geometry: any) => {
    if (instance.geometry === geometry) {
      instance.geometry = initialGeometry;
    }
  };

  const registerMaterial = (material: any) => {
    instance.material = material;
  };
  const unregisterMaterial = (material: any) => {
    if (instance.material === material) {
      instance.material = initialMaterial;
    }
  };

  bindInitialisationProps3D(instance, initialisationProps);
  const [, runtimeWithoutChildren] = splitProps(runtimeProps, ["children"]);
  bindRuntimeProps3D(instance, runtimeWithoutChildren as any);

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    instance.destroy({ children: true });
  });

  return (
    <Mesh3DContext.Provider
      value={{
        mesh: instance,
        registerGeometry,
        unregisterGeometry,
        registerMaterial,
        unregisterMaterial,
      }}
    >
      {(() => {
        const resolved = resolveChildren(() => props.children);
        resolved();
        return instance as PixiMesh3D & JSX.Element;
      })()}
    </Mesh3DContext.Provider>
  ) as PixiMesh3D & JSX.Element;
};

const MODEL_3D_RUNTIME_KEYS = [...CONTAINER3D_RUNTIME_KEYS, "traverse"] as const;

/**
 * A SolidJS component that renders a `Model3D` from an asset source.
 * Synchronizes animation playback with the scoped Pixi.Ticker from context.
 * Supports a `traverse` prop to inspect or customize child meshes/nodes on mount.
 */
export const Model3D: PixiComponent3D<Model3DComponentProps, PixiModel3D> = (props) => {
  const [runtimeProps, initialisationProps] = splitProps(props, MODEL_3D_RUNTIME_KEYS);

  const isUserOwnedInstance = runtimeProps.as !== undefined;
  // Initialize with autoUpdate: false so Pixi's AnimationPlayer does not bind to global Ticker.shared
  const instance =
    props.as ||
    new PixiModel3D({
      ...initialisationProps,
      autoUpdate: false,
    } as any);

  // Re-wire to the scoped context ticker if player exists and autoUpdate is not false
  if (instance.player) {
    instance.player.autoUpdate = false;

    createRenderEffect(
      on(
        () => (props as any).autoUpdate,
        (autoUpdate) => {
          if (autoUpdate === false) return;

          const onTick = (ticker: Ticker) => {
            instance.player?.update(ticker);
          };

          try {
            const ticker = getTicker();
            ticker.add(onTick);
            onCleanup(() => {
              ticker.remove(onTick);
            });
          } catch {
            // Fallback gracefully if mounted without context ticker
          }
        },
      ),
    );
  }

  // Reactive traverse callback to customize model subtrees
  createRenderEffect(() => {
    const fn = (props as any).traverse;
    if (typeof fn === "function") {
      traverse3D(instance, fn);
    }
  });

  bindInitialisationProps3D(instance, initialisationProps);
  const [, runtimeWithoutTraverse] = splitProps(runtimeProps, ["traverse"]);
  bindRuntimeProps3D(instance, runtimeWithoutTraverse as any);

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    instance.destroy({ children: true });
  });

  return instance as PixiModel3D & JSX.Element;
};

/**
 * A SolidJS component that renders a `Sprite3D`.
 */
export const Sprite3D: PixiComponent3D<Sprite3DComponentProps, PixiSprite3D> =
  createLeaf3DComponent<PixiSprite3D, Pixi3D.Sprite3DOptions>(PixiSprite3D);

/**
 * A SolidJS component that renders a `Camera3D`.
 * Must be mounted within a `<View3D>` component. When mounted, it automatically becomes
 * the view's active rendering camera (unless `active={false}` is explicitly provided).
 */
export const Camera3D: PixiComponent3D<Camera3DComponentProps, PixiCamera3D> = (props) => {
  const view = useView3D();

  const [runtimeProps, initialisationProps] = splitProps(props, [...LEAF3D_RUNTIME_KEYS, "active"]);

  const isUserOwnedInstance = runtimeProps.as !== undefined;
  const instance = props.as || new PixiCamera3D({ ...initialisationProps } as any);

  createRenderEffect(
    on(
      () => (props as any).active,
      (active) => {
        if (active === false) return;
        const previousCamera = view.camera;
        view.camera = instance;

        onCleanup(() => {
          if (view.camera === instance) {
            view.camera = previousCamera;
          }
        });
      },
    ),
  );

  bindInitialisationProps3D(instance, initialisationProps);
  bindRuntimeProps3D(instance, runtimeProps as any);

  onCleanup(() => {
    if (isUserOwnedInstance) return;
    instance.destroy({ children: true });
  });

  return instance as PixiCamera3D & JSX.Element;
};

/**
 * A SolidJS component that renders an `AmbientLight`.
 */
export const AmbientLight: PixiComponent3D<AmbientLightComponentProps, PixiAmbientLight> =
  createLeaf3DComponent<PixiAmbientLight, Pixi3D.AmbientLightOptions>(PixiAmbientLight);

/**
 * A SolidJS component that renders a `DirectionalLight`.
 */
export const DirectionalLight: PixiComponent3D<
  DirectionalLightComponentProps,
  PixiDirectionalLight
> = createLeaf3DComponent<PixiDirectionalLight, Pixi3D.DirectionalLightOptions>(
  PixiDirectionalLight,
);

/**
 * A SolidJS component that renders a `PointLight`.
 */
export const PointLight: PixiComponent3D<PointLightComponentProps, PixiPointLight> =
  createLeaf3DComponent<PixiPointLight, Pixi3D.PointLightOptions>(PixiPointLight);

/**
 * A SolidJS component that renders a `SpotLight`.
 */
export const SpotLight: PixiComponent3D<SpotLightComponentProps, PixiSpotLight> =
  createLeaf3DComponent<PixiSpotLight, Pixi3D.SpotLightOptions>(PixiSpotLight);

/**
 * A SolidJS component that renders a `BatchedMesh3D`.
 */
export const BatchedMesh3D: PixiComponent3D<BatchedMesh3DComponentProps, PixiBatchedMesh3D> =
  createLeaf3DComponent<PixiBatchedMesh3D, Pixi3D.BatchedMesh3DOptions>(PixiBatchedMesh3D);

/**
 * A SolidJS component that renders a `ParticleContainer3D`.
 */
export const ParticleContainer3D: PixiComponent3D<
  ParticleContainer3DComponentProps,
  PixiParticleContainer3D
> = createLeaf3DComponent<PixiParticleContainer3D, Pixi3D.ParticleContainer3DOptions>(
  PixiParticleContainer3D,
);
