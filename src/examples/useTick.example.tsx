import type * as Pixi from "pixi.js";
import { Texture } from "pixi.js";
import { Sprite, useTick } from "pixi-solid";

export const UseTickExample = () => {
  let spriteRef: Pixi.Sprite | undefined;

  useTick((ticker) => {
    if (spriteRef) {
      spriteRef.rotation += 0.01 * ticker.deltaTime;
    }
  });

  return <Sprite ref={spriteRef} texture={Texture.WHITE} x={100} y={100} />;
};
