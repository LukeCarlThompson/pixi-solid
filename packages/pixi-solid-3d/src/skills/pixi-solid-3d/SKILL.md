---
name: pixi-solid-3d
description: Use when building 3D scenes and components with pixi-solid-3d. Covers 3D JSX components, vector props, cameras, lighting, materials, and testing patterns.
metadata:
  triggers: "pixi-solid-3d, pixi-solid 3d, View3D, Container3D, Mesh3D, Model3D, OrbitCamera, @pixi/3d"
---

# Pixi-solid-3d guidelines

Use this skill for `pixi-solid-3d` APIs and scene integration. It extends `pixi-solid` with 3D components powered by `@pixi/3d` and `pixi.js` (v8).

## Architecture

In PixiJS v8:

- `<View3D>` is a 2D viewport component placed inside `<PixiCanvas>` (or any 2D container).
- Children of `<View3D>` are mounted into its 3D root (`view.root`, a `Container3D`).
- `<View3D>` provides `View3DContext` so nested components and hooks (`useView3D()`) access the 3D viewport, active camera, tone mapping, and coordinate projections.

## Getting started

Minimal 3D scene with lighting, orbit camera controls, and a PBR mesh:

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

function Scene() {
  const pixiScreen = usePixiScreen();
  const geometry = new CubeGeometry({ width: 2, height: 2, depth: 2 });
  const material = new Material3D({ baseColor: 0x4f88ea, roughness: 0.3 });

  return (
    <View3D width={pixiScreen.width} height={pixiScreen.height} toneMapping="aces">
      <OrbitCamera enableDamping={true} minDistance={2} maxDistance={20} />
      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2.5} x={5} y={8} z={5} castShadow={true} />
      <Mesh3D geometry={geometry} material={material} castShadow receiveShadow />
    </View3D>
  );
}

export function App() {
  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }}>
      <Scene />
    </PixiCanvas>
  );
}
```

## Reactive 3D Vector Props

All 3D components (`<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Camera3D>`, lights) support individual axis props for fine-grained reactivity without re-creating vector objects:

- **Position**: `x`, `y`, `z`, or `positionX`, `positionY`, `positionZ`, or `position={{ x, y, z }}`
- **Scale**: `scaleX`, `scaleY`, `scaleZ`, or uniform `scale={2}`
- **Rotation**: `rotationX`, `rotationY`, `rotationZ` (Euler radians), or `angleX`, `angleY`, `angleZ` (Euler degrees)
- **Origin / Pivot**: `originX`, `originY`, `originZ`, or `origin={0}`
- **Quaternion**: `quaternion={{ x, y, z, w }}`
- **LookAt**: `lookAtX`, `lookAtY`, `lookAtZ`, or `lookAt={{ x, y, z }}`

## Loading 3D Models

Load `.glb` / `.gltf` assets using `Assets.load<Scene3DSource>` and render with `<Model3D>`:

```tsx
import { Assets } from "pixi.js";
import type { Scene3DSource } from "@pixi/3d";
import { Model3D } from "pixi-solid-3d";
import { createResource, Show } from "solid-js";

function Character() {
  const [source] = createResource(() => Assets.load<Scene3DSource>("/assets/character.glb"));

  return (
    <Show when={source()}>{(src) => <Model3D source={src()} castShadow receiveShadow />}</Show>
  );
}
```

## Public API Checklist

| Area                   | Exports                                                                                            | Description                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Viewport & Context** | `<View3D>`, `useView3D`, `View3DContext`                                                           | 2D/3D bridge container and accessor hook                        |
| **Scene Nodes**        | `<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>` | 3D transform nodes                                              |
| **Cameras & Controls** | `<Camera3D>`, `<OrbitCamera>`                                                                      | Perspective/orthographic cameras and interactive orbit controls |
| **Lighting**           | `<DirectionalLight>`, `<PointLight>`, `<AmbientLight>`, `<SpotLight>`                              | Real-time scene lights                                          |
| **Utils**              | `useWorldToScreen`, `useScreenToWorld`                                                             | Reactive 3D-to-2D and 2D-to-3D projection utilities             |
| **Testing**            | Import directly from `pixi-solid/testing` (`mountScene`, `getByLabel`, `cleanup`)                  | Headless testing utilities                                      |
