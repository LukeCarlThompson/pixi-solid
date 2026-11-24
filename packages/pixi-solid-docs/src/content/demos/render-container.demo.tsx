import { PixiCanvas, RenderContainer, Sprite } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading } from "solid-js";

import assetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the texture arrives.
  const texture = createMemo(() => Assets.load<Pixi.Texture>(assetUrl));

  return (
    <RenderContainer
      render={(renderer) => {
        renderer.clear({
          clearColor: "pink",
        });
      }}
    >
      <Sprite texture={texture()} />
    </RenderContainer>
  );
};

export const Demo = () => (
  <Loading fallback={<div>Loading...</div>}>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <DemoComponent />
    </PixiCanvas>
  </Loading>
);
