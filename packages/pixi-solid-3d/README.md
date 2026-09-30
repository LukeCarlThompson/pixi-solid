# pixi-solid-3d

Declarative 3D components and utilities for writing PixiJS 3D applications with SolidJS, powered by [`@pixi/3d`](https://github.com/pixijs/pixi-3d).

## Features

- 🧊 **Declarative 3D Scene Graph**: Use `<View3D>`, `<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Sprite3D>`.
- 💡 **Complete Lighting Suite**: `<DirectionalLight>`, `<PointLight>`, `<AmbientLight>`, `<SpotLight>`.
- 🎥 **Cameras & Orbit Controls**: `<Camera3D>` and interactive `<OrbitCamera>`.
- ⚡ **Fine-Grained Reactivity**: Reactive binding for 3D vectors (`x`, `y`, `z`, `scale`, `rotation`, `quaternion`).
- 🔄 **Seamless 2D/3D Hybrid**: Nest `<View3D>` directly into `<PixiCanvas>` alongside 2D HUDs and UI.

## Installation

```bash
pnpm add pixi-solid-3d @pixi/3d pixi-solid pixi.js solid-js
```

## Quick Example

```tsx
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  View3D,
  Container3D,
  Mesh3D,
  DirectionalLight,
  AmbientLight,
  OrbitCamera,
} from "pixi-solid-3d";
import { CubeGeometry, Material3D } from "@pixi/3d";

export const Scene = () => {
  const pixiScreen = usePixiScreen();
  const geometry = new CubeGeometry({ width: 2, height: 2, depth: 2 });
  const material = new Material3D({ baseColor: 0x4f88ea, roughness: 0.3 });

  return (
    <View3D width={pixiScreen.width} height={pixiScreen.height} toneMapping="aces">
      <OrbitCamera enableDamping={true} minDistance={2} maxDistance={20} />
      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2.5} x={5} y={8} z={5} />
      <Mesh3D geometry={geometry} material={material} castShadow receiveShadow />
    </View3D>
  );
};

export const App = () => (
  <PixiCanvas>
    <Scene />
  </PixiCanvas>
);
```

## Documentation

Full documentation, interactive live demos, and API reference are available at the [Pixi Solid Docs](https://lukecarlthompson.github.io/pixi-solid/3d/overview/).
