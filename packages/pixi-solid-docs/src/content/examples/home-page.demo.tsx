import type * as Pixi from "pixi.js";
import { Assets, Rectangle, TextureStyle } from "pixi.js";
import {
  AnimatedSprite,
  Container,
  getPixiApp,
  onTick,
  PixiApplication,
  PixiCanvas,
  PixiStage,
  Sprite,
  TilingSprite,
} from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import { createResource, Show } from "solid-js";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const skyTexture = await Assets.load<Pixi.Texture>("/sky.png");
    const groundTexture = await Assets.load<Pixi.Texture>("/ground-tile.png");
    const runTextures = await Assets.load<Pixi.Texture>([
      "/run_0.png",
      "/run_1.png",
      "/run_2.png",
      "/run_3.png",
      "/run_4.png",
      "/run_5.png",
    ]);

    return { skyTexture, groundTexture, runTextures: Object.values(runTextures) };
  });
  const sceneBounds = new Rectangle(0, 0, 200, 133);

  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas style={{ "aspect-ratio": `${sceneBounds.width}/${sceneBounds.height}` }}>
        {/* Show our Stage when the assets are loaded */}
        <Show when={textureResource()}>
          {(textures) => (
            <PixiStage>
              <Container
                boundsArea={sceneBounds}
                ref={(container) => {
                  const app = getPixiApp();
                  onTick(() => {
                    objectFit(container, app.renderer, "cover");
                  });
                }}
              >
                <Sprite texture={textures().skyTexture} />
                <TilingSprite
                  ref={(tileRef) => {
                    onTick((ticker) => {
                      tileRef.tilePosition.x -= 1.3 * ticker.deltaTime;
                    });
                  }}
                  texture={textures().groundTexture}
                  width={sceneBounds.width}
                  height={sceneBounds.height / 3}
                  position={{ x: 0, y: (sceneBounds.height / 3) * 2 }}
                />
                <AnimatedSprite
                  ref={(animatedSprite) => {
                    animatedSprite.play();
                  }}
                  textures={textures().runTextures}
                  animationSpeed={0.25}
                  anchor={{ x: 0.5, y: 0.5 }}
                  position={{ x: sceneBounds.width * 0.5, y: sceneBounds.height * 0.5 }}
                />
              </Container>
            </PixiStage>
          )}
        </Show>
      </PixiCanvas>
    </PixiApplication>
  );
};
