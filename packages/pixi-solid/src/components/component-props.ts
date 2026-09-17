import type {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  HTMLText,
  MeshPlane,
  MeshRope,
  NineSliceSprite,
  ParticleContainer,
  PerspectiveMesh,
  RenderContainer,
  RenderLayer,
  Sprite,
  SplitBitmapText,
  SplitText,
  Text,
  TilingSprite,
} from "./components";

export type AnimatedSpriteProps = Parameters<typeof AnimatedSprite>[0];
export type BitmapTextProps = Parameters<typeof BitmapText>[0];
export type ContainerProps = Parameters<typeof Container>[0];
export type GraphicsProps = Parameters<typeof Graphics>[0];
export type HTMLTextProps = Parameters<typeof HTMLText>[0];
export type MeshPlaneProps = Parameters<typeof MeshPlane>[0];
export type MeshRopeProps = Parameters<typeof MeshRope>[0];
export type NineSliceSpriteProps = Parameters<typeof NineSliceSprite>[0];
export type ParticleContainerProps = Parameters<typeof ParticleContainer>[0];
export type PerspectiveMeshProps = Parameters<typeof PerspectiveMesh>[0];
export type RenderContainerProps = Parameters<typeof RenderContainer>[0];
export type RenderLayerProps = Parameters<typeof RenderLayer>[0];
export type SpriteProps = Parameters<typeof Sprite>[0];
export type SplitBitmapTextProps = Parameters<typeof SplitBitmapText>[0];
export type SplitTextProps = Parameters<typeof SplitText>[0];
export type TextProps = Parameters<typeof Text>[0];
export type TilingSpriteProps = Parameters<typeof TilingSprite>[0];
