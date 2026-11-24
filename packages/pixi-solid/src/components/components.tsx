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
import { createEffect, omit } from "solid-js";

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

export const AnimatedSprite: Component<AnimatedSpriteProps> = createAnimatedSpriteComponent<
  PixiAnimatedSprite,
  Pixi.AnimatedSpriteOptions
>(PixiAnimatedSprite);
export const BitmapText: Component<BitmapTextProps> = createSpriteComponent<
  PixiBitmapText,
  Pixi.TextOptions
>(PixiBitmapText);
export const Container: Component<ContainerProps> = createContainerComponent<
  PixiContainer,
  Pixi.ContainerOptions
>(PixiContainer);
/**
 * A SolidJS component that renders a `PIXI.Graphics`.
 *
 * Use the `draw` prop for drawing, which re-runs when its reactive reads change.
 * Use a ref to reach the instance for anything else, such as reading bounds.
 */
export const Graphics: Component<GraphicsProps> = (props) => {
  // `draw` is consumed here rather than by the instance, so keep it out of the
  // constructor options and out of the prop binding.
  const instance = createLeafComponent<PixiGraphics, Pixi.GraphicsOptions>(PixiGraphics)(
    omit(props, "draw") as GraphicsProps,
  );

  createEffect(
    () => {
      const draw = props.draw;

      if (!draw) return;

      // Clear first: the callback describes the whole content, so a re-run must
      // replace the previous drawing instead of adding to it.
      instance.clear();
      draw(instance);
    },
    () => {},
  );

  return instance;
};
export const HTMLText: Component<HTMLTextProps> = createSpriteComponent<
  PixiHTMLText,
  Pixi.HTMLTextOptions
>(PixiHTMLText);

export const MeshPlane: Component<MeshPlaneProps> = createLeafComponent<
  PixiMeshPlane,
  Pixi.MeshPlaneOptions
>(PixiMeshPlane);

export const MeshRope: Component<MeshRopeProps> = createLeafComponent<
  PixiMeshRope,
  Pixi.MeshRopeOptions
>(PixiMeshRope);

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

export const PerspectiveMesh: Component<PerspectiveMeshProps> = createLeafComponent<
  PixiPerspectiveMesh,
  Pixi.PerspectivePlaneOptions
>(PixiPerspectiveMesh);

export const RenderContainer: Component<RenderContainerProps> = createContainerComponent<
  PixiRenderContainer,
  Pixi.RenderContainerOptions
>(PixiRenderContainer);

export const RenderLayer: Component<RenderLayerProps> = createContainerComponent<
  PixiRenderLayer,
  Pixi.RenderLayerOptions
>(PixiRenderLayer);

export const Sprite: Component<SpriteProps> = createSpriteComponent<PixiSprite, Pixi.SpriteOptions>(
  PixiSprite,
);

export const Text: Component<TextProps> = createSpriteComponent<PixiText, Pixi.CanvasTextOptions>(
  PixiText,
);

export const SplitText: Component<SplitTextProps> = createLeafComponent<
  PixiSplitText,
  Pixi.SplitTextOptions
>(PixiSplitText);

export const SplitBitmapText: Component<SplitBitmapTextProps> = createLeafComponent<
  PixiSplitBitmapText,
  Pixi.SplitBitmapTextOptions
>(PixiSplitBitmapText);

export const TilingSprite: Component<TilingSpriteProps> = createTilingSpriteComponent<
  PixiTilingSprite,
  Pixi.TilingSpriteOptions
>(PixiTilingSprite);
