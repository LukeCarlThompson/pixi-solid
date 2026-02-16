import { PerspectiveMesh, PixiCanvas, usePixiScreen } from "pixi-solid";
import { objectFit } from "pixi-solid/utils";
import type * as Pixi from "pixi.js";
import { Assets } from "pixi.js";
import { createResource, Show } from "solid-js";

import assetUrl from "@/assets/ground.webp";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  // Create a resource to load the nine slice texture
  const [textureResource] = createResource(() =>
    Assets.load<Pixi.Texture>({ alias: "ground", src: assetUrl }),
  );

  return (
    <Show when={textureResource()}>
      <PerspectiveMesh
        label="Ground"
        texture={Assets.get("ground")}
        verticesX={20}
        verticesY={20}
        x0={50}
        y0={20}
        x1={150}
        y1={20}
        x2={200}
        y2={60}
        x3={0}
        y3={60}
        ref={(component) => {
          objectFit(component, pixiScreen, "contain");
        }}
      />
    </Show>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
