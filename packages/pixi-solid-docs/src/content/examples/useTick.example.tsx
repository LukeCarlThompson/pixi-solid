import type * as Pixi from "pixi.js";
import { Texture } from "pixi.js";
import { onTick, Sprite } from "pixi-solid";

export const OnTickExample = () => {
  let spriteRef: Pixi.Sprite | undefined;

  onTick((ticker) => {
    if (spriteRef) {
      spriteRef.rotation += 0.01 * ticker.deltaTime;
    }
  });

  return <Sprite ref={spriteRef} texture={Texture.WHITE} x={100} y={100} />;
};
