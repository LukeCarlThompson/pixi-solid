import { onTick, PixiCanvas, Sprite } from "pixi-solid";
import { Texture } from "pixi.js";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const RotatingSpriteBySignal = (props: { texture: Pixi.Texture }) => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    // Set a signal every frame
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return <Sprite texture={props.texture} anchor={0.5} rotation={rotation()} />;
};

const RotatingSprite = (props: { texture: Pixi.Texture }) => {
  return (
    <Sprite
      texture={props.texture}
      anchor={0.5}
      ref={(sprite) => {
        onTick((ticker) => {
          // Update rotation directly every frame
          // Slightly more efficient but limited in scope
          sprite.rotation = sprite.rotation + 0.01 * ticker.deltaTime;
        });
      }}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiCanvas>
      <RotatingSpriteBySignal texture={Texture.WHITE} />
    </PixiCanvas>
  );
};
