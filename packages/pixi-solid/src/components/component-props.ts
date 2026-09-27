import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import type { Ref } from "solid-js";

import type { PixiSolidEventHandlerMap } from "./event-properties";
import type { AnchorPointAxisProps, CommonPointAxisProps, TilingPointAxisProps } from "./factories";

type InstanceProps<Instance extends Pixi.Container> = {
  ref?: Ref<Instance>;
  as?: Instance;
};

type CommonComponentProps = PixiSolidEventHandlerMap & CommonPointAxisProps;
type SpriteComponentProps = CommonComponentProps & AnchorPointAxisProps;
type TilingComponentProps = SpriteComponentProps & TilingPointAxisProps;

export type AnimatedSpriteProps = SpriteComponentProps &
  Omit<Pixi.AnimatedSpriteOptions, "children"> &
  InstanceProps<Pixi.AnimatedSprite>;

export type BitmapTextProps = SpriteComponentProps &
  Omit<Pixi.TextOptions, "children"> &
  InstanceProps<Pixi.BitmapText>;

export type ContainerProps = CommonComponentProps &
  Omit<Pixi.ContainerOptions, "children"> &
  InstanceProps<Pixi.Container> & {
    children?: JSX.Element;
  };

export type GraphicsProps = CommonComponentProps &
  Omit<Pixi.GraphicsOptions, "children"> &
  InstanceProps<Pixi.Graphics> & {
    /**
     * Draws the content of this `Graphics`.
     *
     * The callback runs once on mount, then again whenever a reactive value it
     * reads changes. The instance is cleared before every run, so the callback
     * describes the whole content and a re-run replaces the previous drawing
     * instead of adding to it.
     *
     * ```tsx
     * <Graphics draw={(graphics) => graphics.rect(0, 0, size(), size()).fill("#ff0000")} />
     * ```
     */
    draw?: (graphics: Pixi.Graphics) => void;
  };

export type HTMLTextProps = SpriteComponentProps &
  Omit<Pixi.HTMLTextOptions, "children"> &
  InstanceProps<Pixi.HTMLText>;

export type MeshPlaneProps = CommonComponentProps &
  Omit<Pixi.MeshPlaneOptions, "children"> &
  InstanceProps<Pixi.MeshPlane>;

export type MeshRopeProps = CommonComponentProps &
  Omit<Pixi.MeshRopeOptions, "children"> &
  InstanceProps<Pixi.MeshRope>;

export type NineSliceSpriteProps = SpriteComponentProps &
  Omit<Pixi.NineSliceSpriteOptions, "children"> &
  InstanceProps<Pixi.NineSliceSprite>;

export type ParticleContainerProps = CommonComponentProps &
  Omit<Pixi.ParticleContainerOptions, "children"> &
  InstanceProps<Pixi.ParticleContainer>;

export type PerspectiveMeshProps = CommonComponentProps &
  Omit<Pixi.PerspectivePlaneOptions, "children"> &
  InstanceProps<Pixi.PerspectiveMesh>;

export type RenderContainerProps = CommonComponentProps &
  Omit<Pixi.RenderContainerOptions, "children"> &
  InstanceProps<Pixi.RenderContainer> & {
    children?: JSX.Element;
  };

export type RenderLayerProps = CommonComponentProps &
  Omit<Pixi.RenderLayerOptions, "children"> &
  InstanceProps<Pixi.RenderLayer> & {
    children?: JSX.Element;
  };

export type SpriteProps = SpriteComponentProps &
  Omit<Pixi.SpriteOptions, "children"> &
  InstanceProps<Pixi.Sprite>;

export type SplitBitmapTextProps = CommonComponentProps &
  Omit<Pixi.SplitBitmapTextOptions, "children"> &
  InstanceProps<Pixi.SplitBitmapText>;

export type SplitTextProps = CommonComponentProps &
  Omit<Pixi.SplitTextOptions, "children"> &
  InstanceProps<Pixi.SplitText>;

export type TextProps = SpriteComponentProps &
  Omit<Pixi.CanvasTextOptions, "children"> &
  InstanceProps<Pixi.Text>;

export type TilingSpriteProps = TilingComponentProps &
  Omit<Pixi.TilingSpriteOptions, "children"> &
  InstanceProps<Pixi.TilingSprite>;
