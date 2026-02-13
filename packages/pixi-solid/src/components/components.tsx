import type * as Pixi from "pixi.js";
import {
  AnimatedSprite as PixiAnimatedSprite,
  BitmapText as PixiBitmapText,
  Container as PixiContainer,
  Graphics as PixiGraphics,
  HTMLText as PixiHTMLText,
  MeshPlane as PixiMeshPlane,
  MeshRope as PixiMeshRope,
  NineSliceSprite as PixiNineSliceSprite,
  ParticleContainer as PixiParticleContainer,
  PerspectiveMesh as PixiPerspectiveMesh,
  RenderContainer as PixiRenderContainer,
  RenderLayer as PixiRenderLayer,
  Sprite as PixiSprite,
  Text as PixiText,
  TilingSprite as PixiTilingSprite,
} from "pixi.js";

import { createContainerComponent, createLeafComponent } from "./component-factories";

/**
 * A SolidJS component that renders a `PIXI.AnimatedSprite`.
 */
export const AnimatedSprite = createLeafComponent<PixiAnimatedSprite, Pixi.AnimatedSpriteOptions>(
  PixiAnimatedSprite,
);
/**
 * A SolidJS component that renders a `PIXI.BitmapText`.
 */
export const BitmapText = createLeafComponent<PixiBitmapText, Pixi.TextOptions>(PixiBitmapText);
/**
 * A SolidJS component that renders a `PIXI.Container`.
 */
export const Container = createContainerComponent<PixiContainer, Pixi.ContainerOptions>(
  PixiContainer,
);
/**
 * A SolidJS component that renders a `PIXI.Graphics`.
 * Use a ref to access the underlying graphics instance and draw with it.
 */
export const Graphics = createLeafComponent<PixiGraphics, Pixi.GraphicsOptions>(PixiGraphics);
/**
 * A SolidJS component that renders a `PIXI.HTMLText`.
 */
export const HTMLText = createLeafComponent<PixiHTMLText, Pixi.HTMLTextOptions>(PixiHTMLText);

/**
 * A SolidJS component that renders a `PIXI.MeshPlane`.
 */
export const MeshPlane = createLeafComponent<PixiMeshPlane, Pixi.MeshPlaneOptions>(PixiMeshPlane);

/**
 * A SolidJS component that renders a `PIXI.MeshRope`.
 */
export const MeshRope = createLeafComponent<PixiMeshRope, Pixi.MeshRopeOptions>(PixiMeshRope);

/**
 * A SolidJS component that renders a `PIXI.NineSliceSprite`.
 */
export const NineSliceSprite = createLeafComponent<
  PixiNineSliceSprite,
  Pixi.NineSliceSpriteOptions
>(PixiNineSliceSprite);

/**
 * A SolidJS component that renders a `PIXI.ParticleContainer`.
 *
 * Particles should be added and removed from this component imperatively. Please see the docs for a reference example.
 */
export const ParticleContainer = createLeafComponent<
  PixiParticleContainer,
  Pixi.ParticleContainerOptions
>(PixiParticleContainer);

/**
 * A SolidJS component that renders a `PIXI.PerspectiveMesh`.
 */
export const PerspectiveMesh = createLeafComponent<
  PixiPerspectiveMesh,
  Pixi.PerspectivePlaneOptions
>(PixiPerspectiveMesh);

/**
 * A SolidJS component that renders a `PIXI.RenderContainer`.
 */
export const RenderContainer = createContainerComponent<
  PixiRenderContainer,
  Pixi.RenderContainerOptions
>(PixiRenderContainer);

/**
 * A SolidJS component that renders a `PIXI.RenderLayer`.
 */
export const RenderLayer = createContainerComponent<PixiRenderLayer, Pixi.RenderLayerOptions>(
  PixiRenderLayer,
);

/**
 * A SolidJS component that renders a `PIXI.Sprite`.
 */
export const Sprite = createLeafComponent<PixiSprite, Pixi.SpriteOptions>(PixiSprite);
/**
 * A SolidJS component that renders a `PIXI.Text`.
 */
export const Text = createLeafComponent<PixiText, Pixi.CanvasTextOptions>(PixiText);

/**
 * A SolidJS component that renders a `PIXI.TilingSprite`.
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

// TODO: Do we need a component for the Culler. It needs to interact with the stage directly.
// export const Culler = createLeafComponent<PixiCuller, Pixi.Culler>(PixiCuller);
