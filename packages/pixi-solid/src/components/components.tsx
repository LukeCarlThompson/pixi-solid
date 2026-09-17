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
  SplitText as PixiSplitText,
  SplitBitmapText as PixiSplitBitmapText,
  Text as PixiText,
  TilingSprite as PixiTilingSprite,
} from "pixi.js";
import type { Component } from "solid-js";

import type {
  AnimatedSpriteProps,
  BitmapTextProps,
  ContainerProps,
  GraphicsProps,
  HTMLTextProps,
  MeshPlaneProps,
  MeshRopeProps,
  NineSliceSpriteProps,
  ParticleContainerProps,
  PerspectiveMeshProps,
  RenderContainerProps,
  RenderLayerProps,
  SpriteProps,
  SplitBitmapTextProps,
  SplitTextProps,
  TextProps,
  TilingSpriteProps,
} from "./component-props";
import {
  createAnimatedSpriteComponent,
  createContainerComponent,
  createLeafComponent,
  createSpriteComponent,
  createTilingSpriteComponent,
} from "./factories";

/**
 * A SolidJS component that renders a `PIXI.AnimatedSprite`.
 */
export const AnimatedSprite: Component<AnimatedSpriteProps> = createAnimatedSpriteComponent<
  PixiAnimatedSprite,
  Pixi.AnimatedSpriteOptions
>(PixiAnimatedSprite);
/**
 * A SolidJS component that renders a `PIXI.BitmapText`.
 */
export const BitmapText: Component<BitmapTextProps> = createSpriteComponent<
  PixiBitmapText,
  Pixi.TextOptions
>(PixiBitmapText);
/**
 * A SolidJS component that renders a `PIXI.Container`.
 */
export const Container: Component<ContainerProps> = createContainerComponent<
  PixiContainer,
  Pixi.ContainerOptions
>(PixiContainer);
/**
 * A SolidJS component that renders a `PIXI.Graphics`.
 * Use a ref to access the underlying instance and call its imperative
 * draw methods (e.g. `rect()`, `fill()`, `stroke()`).
 */
export const Graphics: Component<GraphicsProps> = createLeafComponent<
  PixiGraphics,
  Pixi.GraphicsOptions
>(PixiGraphics);
/**
 * A SolidJS component that renders a `PIXI.HTMLText`.
 */
export const HTMLText: Component<HTMLTextProps> = createSpriteComponent<
  PixiHTMLText,
  Pixi.HTMLTextOptions
>(PixiHTMLText);

/**
 * A SolidJS component that renders a `PIXI.MeshPlane`.
 */
export const MeshPlane: Component<MeshPlaneProps> = createLeafComponent<
  PixiMeshPlane,
  Pixi.MeshPlaneOptions
>(PixiMeshPlane);

/**
 * A SolidJS component that renders a `PIXI.MeshRope`.
 */
export const MeshRope: Component<MeshRopeProps> = createLeafComponent<
  PixiMeshRope,
  Pixi.MeshRopeOptions
>(PixiMeshRope);

/**
 * A SolidJS component that renders a `PIXI.NineSliceSprite`.
 */
export const NineSliceSprite: Component<NineSliceSpriteProps> = createSpriteComponent<
  PixiNineSliceSprite,
  Pixi.NineSliceSpriteOptions
>(PixiNineSliceSprite);

/**
 * A SolidJS component that renders a `PIXI.ParticleContainer`.
 *
 * Particles should be added and removed from this component imperatively. Please see the docs for a reference example.
 */
export const ParticleContainer: Component<ParticleContainerProps> = createLeafComponent<
  PixiParticleContainer,
  Pixi.ParticleContainerOptions
>(PixiParticleContainer);

/**
 * A SolidJS component that renders a `PIXI.PerspectiveMesh`.
 */
export const PerspectiveMesh: Component<PerspectiveMeshProps> = createLeafComponent<
  PixiPerspectiveMesh,
  Pixi.PerspectivePlaneOptions
>(PixiPerspectiveMesh);

/**
 * A SolidJS component that renders a `PIXI.RenderContainer`.
 */
export const RenderContainer: Component<RenderContainerProps> = createContainerComponent<
  PixiRenderContainer,
  Pixi.RenderContainerOptions
>(PixiRenderContainer);

/**
 * A SolidJS component that renders a `PIXI.RenderLayer`.
 */
export const RenderLayer: Component<RenderLayerProps> = createContainerComponent<
  PixiRenderLayer,
  Pixi.RenderLayerOptions
>(PixiRenderLayer);

/**
 * A SolidJS component that renders a `PIXI.Sprite`.
 */
export const Sprite: Component<SpriteProps> = createSpriteComponent<
  PixiSprite,
  Pixi.SpriteOptions
>(PixiSprite);

/**
 * A SolidJS component that renders a `PIXI.Text`.
 */
export const Text: Component<TextProps> = createSpriteComponent<
  PixiText,
  Pixi.CanvasTextOptions
>(PixiText);

/**
 * A SolidJS component that renders a `PIXI.SplitText`.
 */
export const SplitText: Component<SplitTextProps> = createLeafComponent<
  PixiSplitText,
  Pixi.SplitTextOptions
>(PixiSplitText);

/**
 * A SolidJS component that renders a `PIXI.SplitBitmapText`.
 */
export const SplitBitmapText: Component<SplitBitmapTextProps> = createLeafComponent<
  PixiSplitBitmapText,
  Pixi.SplitBitmapTextOptions
>(PixiSplitBitmapText);

/**
 * A SolidJS component that renders a `PIXI.TilingSprite`.
 */
export const TilingSprite: Component<TilingSpriteProps> = createTilingSpriteComponent<
  PixiTilingSprite,
  Pixi.TilingSpriteOptions
>(PixiTilingSprite);
