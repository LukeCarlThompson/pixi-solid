import { Container, Graphics, PixiCanvas, Sprite, usePixiScreen } from "pixi-solid";
import { ObjectFitContainer } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createMemo, Loading, onCleanup } from "solid-js";

import skyAssetUrl from "@/assets/sky.png";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Solid 2 removed `createResource`. An async `createMemo` is the replacement: reading it
  // suspends, so the enclosing `<Loading>` holds the scene until the texture arrives.
  const skyTexture = createMemo(() => Assets.load<Pixi.Texture>(skyAssetUrl));

  let graphicsRef: Pixi.Graphics | undefined;

  const handlePointerMove = (e: Pixi.FederatedPointerEvent) => {
    if (!graphicsRef) return;

    graphicsRef.position.set(e.screenX, e.screenY);
  };

  onCleanup(() => {
    if (graphicsRef) graphicsRef.destroy();
  });

  return (
    <Loading>
      <Container onglobalpointermove={handlePointerMove} eventMode="static">
        <Graphics
          ref={(instance) => {
            graphicsRef = instance;
            instance.circle(0, 0, 100).fill(0x000000);
          }}
        />
        <ObjectFitContainer width={pixiScreen.width} height={pixiScreen.height} fitMode="cover">
          <Sprite label="sky" texture={skyTexture()} mask={graphicsRef} />
        </ObjectFitContainer>
      </Container>
    </Loading>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
