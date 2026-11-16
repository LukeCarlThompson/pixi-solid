import { ContainerTexture } from "@pixi/3d";
import { getRenderer, getTicker } from "pixi-solid";
import type { ColorSource } from "pixi.js";
import { Container } from "pixi.js";
import { onCleanup, type JSX } from "solid-js";

export type ContainerTextureOptions = {
  /** Width of the rendered texture in pixels. Defaults to the content's bounds. */
  width?: number;
  /** Height of the rendered texture in pixels. Defaults to the content's bounds. */
  height?: number;
  /** Texels per logical pixel. Defaults to `1`. */
  resolution?: number;
  /** Smooth the rendered image when it is scaled. Defaults to `false`. */
  antialias?: boolean;
  /** Colour behind content that does not cover the whole texture. Defaults to transparent. */
  clearColor?: ColorSource;
  /**
   * Re-render every frame from the ticker in scope. Defaults to `true`.
   *
   * Set it to `false` for static content and call `texture.render()` after each change.
   */
  autoUpdate?: boolean;
};

/**
 * Wraps `@pixi/3d`'s `ContainerTexture` with the renderer and ticker from context.
 *
 * The class itself needs a renderer, attaches `autoUpdate` to `Ticker.shared`, and owns a render
 * target nobody frees. The hook resolves all three: it takes the renderer and the ticker from the
 * surrounding `<PixiCanvas>` or `<PixiApplicationProvider>`, drives rendering from the same ticker as
 * the rest of the app, and frees the texture on unmount. Everything else is the class's own
 * behaviour, including `containerSource` for slicing frames and `setContainer` for swapping content.
 *
 * @param content - The 2D content to draw, as JSX. A pixi-solid element arrives already filled with
 * its children, because the parent component binds them. Wrap several roots in a `<Container>`.
 * @param options - Size, resolution and update behaviour.
 * @returns A `ContainerTexture`, usable in any material texture slot.
 *
 * @example
 * ```tsx
 * const label = createContainerTexture(
 *   <Container>
 *     <Text text="Now serving" style={{ fontSize: 48 }} />
 *   </Container>,
 *   { width: 512, height: 128 },
 * );
 *
 * <Mesh3D
 *   geometry={new PlaneGeometry({ width: 4, height: 1 })}
 *   material={new FlatMaterial({ baseColorTexture: label })}
 * />;
 * ```
 *
 * The image is stored the other way up from an image texture: it shows upright on a default
 * `PlaneGeometry`, and upside down on a sphere, a loaded model or a 2D sprite. On those, set
 * `scale.y = -1` and `anchor.y = 1` on the object that shows it.
 */
export const createContainerTexture = (
  content: JSX.Element,
  options: ContainerTextureOptions = {},
): ContainerTexture => {
  // JSX that resolves to a single pixi-solid component is that component's instance at runtime, but
  // its static type is `JSX.Element`. Checked rather than asserted, so a fragment or a plain value
  // fails loudly here instead of inside the texture.
  if (!(content instanceof Container)) {
    throw new Error(
      "createContainerTexture expects a 2D container. Pass a single element such as <Container>…</Container>.",
    );
  }

  const texture = new ContainerTexture({
    container: content,
    renderer: getRenderer(),
    width: options.width,
    height: options.height,
    resolution: options.resolution,
    antialias: options.antialias,
    clearColor: options.clearColor,
  });

  // `ContainerTexture` attaches `autoUpdate` to `Ticker.shared`, which is not the ticker this app
  // runs. Drive it from the ticker in scope instead, the way `AnimatedSprite` is handled.
  texture.autoUpdate = false;

  if (options.autoUpdate !== false) {
    const render = (): void => texture.render();
    const ticker = getTicker();

    ticker.add(render);
    onCleanup(() => ticker.remove(render));
  }

  onCleanup(() => {
    // Destroys the render target and detaches the content. The content belongs to the components
    // that built it, so they are left to destroy themselves.
    texture.destroy(true);
  });

  return texture;
};
