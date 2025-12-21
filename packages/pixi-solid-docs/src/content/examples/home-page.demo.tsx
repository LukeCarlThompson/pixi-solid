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
import groundAssetUrl from "@/assets/ground-tile.png";
import assetUrl_01 from "@/assets/run_01.png";
import assetUrl_02 from "@/assets/run_02.png";
import assetUrl_03 from "@/assets/run_03.png";
import assetUrl_04 from "@/assets/run_04.png";
import assetUrl_05 from "@/assets/run_05.png";
import assetUrl_06 from "@/assets/run_06.png";
import skyAssetUrl from "@/assets/sky.png";

export const DemoApp = () => {
  // Create a resource to load the sky texture
  const [textureResource] = createResource(async () => {
    // Setting scale mode to nearest for crisp pixel art
    TextureStyle.defaultOptions.scaleMode = "nearest";

    const skyTexture = await Assets.load<Pixi.Texture>(skyAssetUrl);
    const groundTexture = await Assets.load<Pixi.Texture>(groundAssetUrl);
    const runTextures = await Assets.load<Pixi.Texture>([
      assetUrl_01,
      assetUrl_02,
      assetUrl_03,
      assetUrl_04,
      assetUrl_05,
      assetUrl_06,
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
