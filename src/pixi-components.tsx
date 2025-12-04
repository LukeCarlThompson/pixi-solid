import type * as pixi from "pixi.js";

import type { JSX, Ref } from "solid-js";
import {
  AnimatedSprite as PixiAnimatedSprite,
  BitmapText as PixiBitmapText,
  Container as PixiContainer,
  Graphics as PixiGraphics,
  HTMLText as PixiHTMLText,
  Mesh as PixiMesh,
  MeshPlane as PixiMeshPlane,
  MeshRope as PixiMeshRope,
  MeshSimple as PixiMeshSimple,
  NineSliceSprite as PixiNineSliceSprite,
  ParticleContainer as PixiParticleContainer,
  PerspectiveMesh as PixiPerspectiveMesh,
  RenderContainer as PixiRenderContainer,
  RenderLayer as PixiRenderLayer,
  Sprite as PixiSprite,
  Text as PixiText,
  TilingSprite as PixiTilingSprite,
} from "pixi.js";
import { createRenderEffect, splitProps } from "solid-js"; // Ensure splitProps is imported
import { insert, setProp } from "./renderer";

import { PIXI_EVENT_HANDLER_NAMES } from "./pixi-events";
import type { PixiEventHandlerMap } from "./pixi-events";

// Prop definition for components that CAN have children
export type ContainerProps<Component> = PixiEventHandlerMap & {
  ref?: Ref<Component>;
  as?: Component;
  children?: JSX.Element;
};

// Prop definition for components that CANNOT have children
export type LeafProps<Component> = Omit<ContainerProps<Component>, "children">;

// Keys that should be split from component props
export const COMMON_PROP_KEYS = ["ref", "as", "children"] as const;

export const applyProps = <InstanceType extends PixiContainer, OptionsType extends ContainerProps<InstanceType>>(
  instance: InstanceType,
  props: OptionsType
) => {
  for (const key in props) {
    if (key === "as") continue;

    if (key === "ref") {
      createRenderEffect(() => {
        // Solid converts the ref prop to a callback function
        (props[key] as unknown as (arg: any) => void)(instance);
      });
    } else if (key === "children") {
      if (!("addChild" in instance)) {
        throw new Error(`Cannot set children on non-container instance.`);
      }
      createRenderEffect(() => {
        insert(instance, () => props.children);
      });
    } else {
      createRenderEffect(() => {
        setProp(instance, key, props[key as keyof typeof props]);
      });
    }
  }
};

const createContainerComponent = <InstanceType extends PixiContainer, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType
) => {
  return (props: Omit<OptionsType, "children"> & ContainerProps<InstanceType>): JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, [...COMMON_PROP_KEYS, ...PIXI_EVENT_HANDLER_NAMES]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    applyProps(instance, initialisationProps);
    applyProps(instance, runtimeProps);

    return instance as unknown as JSX.Element;
  };
};

const createLeafComponent = <InstanceType extends PixiContainer, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType
) => {
  return (props: Omit<OptionsType, "children"> & LeafProps<InstanceType>): JSX.Element => {
    return createContainerComponent<PixiContainer, OptionsType>(PixiClass)(props as any);
  };
};

export const Container = createContainerComponent<PixiContainer, pixi.ContainerOptions>(PixiContainer);
export const AnimatedSprite = createLeafComponent<PixiAnimatedSprite, pixi.AnimatedSpriteOptions>(PixiAnimatedSprite);
export const BitmapText = createLeafComponent<PixiBitmapText, pixi.TextOptions>(PixiBitmapText);
export const Graphics = createLeafComponent<PixiGraphics, pixi.GraphicsOptions>(PixiGraphics);
export const HTMLText = createLeafComponent<PixiHTMLText, pixi.HTMLTextOptions>(PixiHTMLText);
export const Mesh = createLeafComponent<PixiMesh, pixi.MeshOptions>(PixiMesh);
export const MeshPlane = createLeafComponent<PixiMeshPlane, pixi.MeshPlaneOptions>(PixiMeshPlane);
export const MeshRope = createLeafComponent<PixiMeshRope, pixi.MeshRopeOptions>(PixiMeshRope);
export const MeshSimple = createLeafComponent<PixiMeshSimple, pixi.SimpleMeshOptions>(PixiMeshSimple);
export const NineSliceSprite = createLeafComponent<PixiNineSliceSprite, pixi.NineSliceSpriteOptions>(
  PixiNineSliceSprite
);
export const PerspectiveMesh = createLeafComponent<PixiPerspectiveMesh, pixi.PerspectivePlaneOptions>(
  PixiPerspectiveMesh
);
export const RenderContainer = createContainerComponent<PixiRenderContainer, pixi.RenderContainerOptions>(
  PixiRenderContainer
);
export const RenderLayer = createLeafComponent<PixiRenderLayer, pixi.RenderLayerOptions>(PixiRenderLayer);
export const Sprite = createLeafComponent<PixiSprite, pixi.SpriteOptions>(PixiSprite);
export const Text = createLeafComponent<PixiText, pixi.CanvasTextOptions>(PixiText);
export const TilingSprite = createLeafComponent<PixiTilingSprite, pixi.TilingSpriteOptions>(PixiTilingSprite);

// export const MeshGeometry = createLeafComponent<PixiMeshGeometry, pixi.MeshGeometryOptions>(PixiMeshGeometry);
// export const NineSliceGeometry = createLeafComponent<PixiNineSliceGeometry, pixi.NineSliceGeometryOptions>(
//   PixiNineSliceGeometry
// );

// export const Particle = createLeafComponent<PixiParticle, pixi.ParticleOptions>(PixiParticle);
export const ParticleContainer = createContainerComponent<PixiParticleContainer, pixi.ParticleContainerOptions>(
  PixiParticleContainer
);
// export const PerspectivePlaneGeometry = createLeafComponent<
//   PixiPerspectivePlaneGeometry,
//   pixi.PerspectivePlaneGeometryOptions
// >(PixiPerspectivePlaneGeometry);
// export const PlaneGeometry = createLeafComponent<PixiPlaneGeometry, pixi.PlaneGeometryOptions>(PixiPlaneGeometry);
// export const RopeGeometry = createLeafComponent<PixiRopeGeometry, pixi.RopeGeometryOptions>(PixiRopeGeometry);

// TODO: Don't need a component for the Culler. It needs to interact with the stage directly.
// export const Culler = createLeafComponent<PixiCuller, pixi.Culler>(PixiCuller);
