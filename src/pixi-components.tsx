import type * as Pixi from "pixi.js";
import {
  AnimatedSprite as PixiAnimatedSprite,
  BitmapText as PixiBitmapText,
  Container as PixiContainer,
  Graphics as PixiGraphics,
  HTMLText as PixiHTMLText,
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
import type { JSX, Ref } from "solid-js";
import { createRenderEffect, splitProps } from "solid-js";
import type { PixiEventHandlerMap } from "./pixi-events";

import { PIXI_EVENT_HANDLER_NAMES } from "./pixi-events";
import { insert, setProp } from "./renderer";

/**
 * Prop definition for components that CAN have children
 */
export type ContainerProps<Component> = PixiEventHandlerMap & {
  ref?: Ref<Component>;
  as?: Component;
  children?: JSX.Element;
};

/**
 * Prop definition for components that CANNOT have children
 */
export type LeafProps<Component> = Omit<ContainerProps<Component>, "children">;

// Keys that are specific to Solid components and not Pixi props
export const SOLID_PROP_KEYS = ["ref", "as", "children"] as const;

/**
 * Apply's the props to a Pixi instance with subsriptions to maintain reactivity.
 * 
 * @param instance The Pixi instance we want to apply props to.
 * @param props The props object.
 */
export const applyProps = <
  InstanceType extends PixiContainer,
  OptionsType extends ContainerProps<InstanceType>,
>(
  instance: InstanceType,
  props: OptionsType,
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
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (props: Omit<OptionsType, "children"> & ContainerProps<InstanceType>): JSX.Element => {
    const [runtimeProps, initialisationProps] = splitProps(props, [
      ...SOLID_PROP_KEYS,
      ...PIXI_EVENT_HANDLER_NAMES,
    ]);

    const instance = props.as || new PixiClass(initialisationProps as any);

    applyProps(instance, initialisationProps);
    applyProps(instance, runtimeProps);

    return instance as unknown as JSX.Element;
  };
};

const createLeafComponent = <InstanceType extends PixiContainer, OptionsType extends object>(
  PixiClass: new (props: OptionsType) => InstanceType,
) => {
  return (props: Omit<OptionsType, "children"> & LeafProps<InstanceType>): JSX.Element => {
    return createContainerComponent<PixiContainer, OptionsType>(PixiClass)(props as any);
  };
};

/**
 * A SolidJS component that renders a PIXI.AnimatedSprite.
 *
 * **Example**
 * {@includeCode ./examples/AnimatedSprite.example.tsx}
 * 
 * {@link PixiAnimatedSprite}
 *
 */
export const AnimatedSprite = createLeafComponent<PixiAnimatedSprite, Pixi.AnimatedSpriteOptions>(
  PixiAnimatedSprite,
);
/**
 * A SolidJS component that renders a PIXI.BitmapText.
 *
 * **Example**
 * {@includeCode ./examples/BitmapText.example.tsx}
 * 
 * {@link PixiBitmapText}
 *
 */
export const BitmapText = createLeafComponent<PixiBitmapText, Pixi.TextOptions>(PixiBitmapText);
/**
 * A SolidJS component that renders a PIXI.Container.
 *
 * **Example**
 * {@includeCode ./examples/Container.example.tsx}
 *
 */
export const Container = createContainerComponent<PixiContainer, Pixi.ContainerOptions>(
  PixiContainer,
);
/**
 * A SolidJS component that renders a PIXI.Graphics.
 * Use a ref to access the underlying graphics instance and draw with it.
 *
 * **Example**
 * {@includeCode ./examples/Graphics.example.tsx}
 *
 * {@link PixiGraphics}
 */
export const Graphics = createLeafComponent<PixiGraphics, Pixi.GraphicsOptions>(PixiGraphics);
/**
 * A SolidJS component that renders a PIXI.HTMLText.
 *
 * **Example**
 * {@includeCode ./examples/HTMLText.example.tsx}
 *
 * {@link PixiHTMLText}
 */
export const HTMLText = createLeafComponent<PixiHTMLText, Pixi.HTMLTextOptions>(PixiHTMLText);

/**
 * A SolidJS component that renders a PIXI.MeshPlane.
 *
 * **Example**
 * {@includeCode ./examples/MeshPlane.example.tsx}
 *
 * {@link PixiMeshPlane}
 */
export const MeshPlane = createLeafComponent<PixiMeshPlane, Pixi.MeshPlaneOptions>(PixiMeshPlane);

/**
 * A SolidJS component that renders a PIXI.MeshRope.
 *
 * **Example**
 * {@includeCode ./examples/MeshRope.example.tsx}
 *
 * {@link PixiMeshRope}
 */
export const MeshRope = createLeafComponent<PixiMeshRope, Pixi.MeshRopeOptions>(PixiMeshRope);

/**
 * A SolidJS component that renders a PIXI.MeshSimple.
 *
 * **Example**
 * {@includeCode ./examples/MeshSimple.example.tsx}
 *
 * {@link PixiMeshSimple}
 */
export const MeshSimple = createLeafComponent<PixiMeshSimple, Pixi.SimpleMeshOptions>(
  PixiMeshSimple,
);

/**
 * A SolidJS component that renders a PIXI.NineSliceSprite.
 *
 * **Example**
 * {@includeCode ./examples/NineSliceSprite.example.tsx}
 *
 * {@link PixiNineSliceSprite}
 */
export const NineSliceSprite = createLeafComponent<
  PixiNineSliceSprite,
  Pixi.NineSliceSpriteOptions
>(PixiNineSliceSprite);

/**
 * A SolidJS component that renders a PIXI.ParticleContainer.
 *
 * **Example**
 * {@includeCode ./examples/ParticleContainer.example.tsx}
 *
 * {@link PixiParticleContainer}
 */
export const ParticleContainer = createLeafComponent<
  PixiParticleContainer,
  Pixi.ParticleContainerOptions
>(PixiParticleContainer);

/**
 * A SolidJS component that renders a PIXI.PerspectiveMesh.
 *
 * **Example**
 * {@includeCode ./examples/PerspectiveMesh.example.tsx}
 *
 * {@link PixiPerspectiveMesh}
 */
export const PerspectiveMesh = createLeafComponent<
  PixiPerspectiveMesh,
  Pixi.PerspectivePlaneOptions
>(PixiPerspectiveMesh);

/**
 * A SolidJS component that renders a PIXI.RenderContainer.
 *
 * **Example**
 * {@includeCode ./examples/RenderContainer.example.tsx}
 *
 * {@link PixiRenderContainer}
 */
export const RenderContainer = createContainerComponent<
  PixiRenderContainer,
  Pixi.RenderContainerOptions
>(PixiRenderContainer);

/**
 * A SolidJS component that renders a PIXI.RenderLayer.
 *
 * **Example**
 * {@includeCode ./examples/RenderLayer.example.tsx}
 *
 * {@link PixiRenderLayer}
 */
export const RenderLayer = createContainerComponent<PixiRenderLayer, Pixi.RenderLayerOptions>(
  PixiRenderLayer,
);

/**
 * A SolidJS component that renders a PIXI.Sprite.
 *
 * **Example**
 * {@includeCode ./examples/Sprite.example.tsx}
 *
 * {@link PixiSprite}
 */
export const Sprite = createLeafComponent<PixiSprite, Pixi.SpriteOptions>(PixiSprite);
/**
 * A SolidJS component that renders a PIXI.Text.
 *
 * **Example**
 * {@includeCode ./examples/Text.example.tsx}
 *
 * {@link PixiText}
 */
export const Text = createLeafComponent<PixiText, Pixi.CanvasTextOptions>(PixiText);

/**
 * A SolidJS component that renders a PIXI.TilingSprite.
 *
 * **Example**
 * {@includeCode ./examples/TilingSprite.example.tsx}
 *
 * {@link PixiTilingSprite}
 */
export const TilingSprite = createLeafComponent<PixiTilingSprite, Pixi.TilingSpriteOptions>(
  PixiTilingSprite,
);

// export const MeshGeometry = createLeafComponent<PixiMeshGeometry, Pixi.MeshGeometryOptions>(PixiMeshGeometry);
// export const NineSliceGeometry = createLeafComponent<PixiNineSliceGeometry, Pixi.NineSliceGeometryOptions>(
//   PixiNineSliceGeometry
// );

// export const Particle = createLeafComponent<PixiParticle, Pixi.ParticleOptions>(PixiParticle);
// export const PerspectivePlaneGeometry = createLeafComponent<
//   PixiPerspectivePlaneGeometry,
//   Pixi.PerspectivePlaneGeometryOptions
// >(PixiPerspectivePlaneGeometry);
// export const PlaneGeometry = createLeafComponent<PixiPlaneGeometry, Pixi.PlaneGeometryOptions>(PixiPlaneGeometry);
// export const RopeGeometry = createLeafComponent<PixiRopeGeometry, Pixi.RopeGeometryOptions>(PixiRopeGeometry);

// TODO: Don't need a component for the Culler. It needs to interact with the stage directly.
// export const Culler = createLeafComponent<PixiCuller, Pixi.Culler>(PixiCuller);
