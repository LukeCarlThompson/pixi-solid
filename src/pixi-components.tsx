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
import { insert, setProp } from "./runtime";

import { transformedPixiEventNames } from "./pixi-events"; // Import transformedPixiEventNames

// Helper for type safety when iterating over object keys
// This function acts as a user-defined type guard, narrowing 'key' to 'keyof T'
function hasOwnProp<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// Define event handler types for better autocompletion and type safety.
type PixiEventHandlers = {
  [K in keyof pixi.AllFederatedEventMap as `on${Capitalize<K>}`]?: (event: pixi.AllFederatedEventMap[K]) => void;
};

// Prop definition for components that CAN have children
export type ContainerProps<Component> = PixiEventHandlers & {
  ref?: Ref<Component>;
  as?: Component;
  children?: JSX.Element;
};

// TODO: Find a way to enforce that 'children' is not provided with this type
// Prop definition for components that CANNOT have children
export type LeafProps<Component> = PixiEventHandlers & {
  ref?: Ref<Component>;
  as?: Component;
  children?: never;
};

// Keys that should be split from component props
export const CommonPropKeys = ["ref", "as", "children"] as const;

const createContainerComponent = <InstanceType extends PixiContainer, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType
) => {
  return (props: Omit<OptionsType, "children"> & ContainerProps<InstanceType>): JSX.Element => {
    const [common, events, pixiProps] = splitProps(
      props,
      CommonPropKeys,
      transformedPixiEventNames as (keyof typeof props)[]
    );

    // Pass only the pixiProps to the PixiClass constructor
    const instance = common.as || new PixiClass(pixiProps as any);

    // Handle 'ref' prop directly as SolidJs handles this as a signal behind the scenes.
    if (common.ref) {
      (common.ref as (arg: any) => void)(instance);
    }

    // Apply remaining common props (excluding 'ref', 'as', and 'children')
    for (const key in common) {
      if (hasOwnProp(common, key)) {
        if (key !== "ref" && key !== "as" && key !== "children") {
          createRenderEffect(() => {
            setProp(instance, key, common[key]);
          });
        }
      }
    }

    // Apply Pixi-specific props with individual effects for granularity
    for (const key in pixiProps) {
      if (hasOwnProp(pixiProps, key)) {
        createRenderEffect(() => {
          setProp(instance, key, pixiProps[key]);
        });
      }
    }

    // Apply event handlers with individual effects for granularity
    for (const key in events) {
      if (hasOwnProp(events, key)) {
        createRenderEffect(() => {
          setProp(instance, key, events[key]);
        });
      }
    }

    // TODO: Do other checks here for other containers that can have children and check to make sure they are valid children.
    if (instance instanceof PixiContainer) {
      insert(instance, () => common.children);
    }

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

// Explicitly export each PixiJS component using the helper,
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
