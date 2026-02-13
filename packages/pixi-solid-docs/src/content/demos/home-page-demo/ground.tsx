import { onTick, TilingSprite } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { splitProps } from "solid-js";

export type GroundProps = Omit<Pixi.TilingSpriteOptions, "children"> & {
  movementSpeed: number;
  direction: "left" | "right";
};

export const Ground = (props: GroundProps) => {
  const [, pixiProps] = splitProps(props, ["movementSpeed", "direction"]);
  return (
    <TilingSprite
      {...pixiProps}
      label="Ground"
      ref={(tileRef) => {
        onTick((ticker) => {
          tileRef.tilePosition.x +=
            props.movementSpeed * ticker.deltaTime * (props.direction === "left" ? 1 : -1);
        });
      }}
      texture={Assets.get<Pixi.Texture>("ground")}
    />
  );
};
