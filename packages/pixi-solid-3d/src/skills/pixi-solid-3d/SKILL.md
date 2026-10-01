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
- `<View3DProvider>` **creates and owns** a `View3D` and shares it through `View3DContext`. A `<View3D>` beneath a provider mounts that same instance instead of creating one; with no provider, `<View3D>` creates and owns its own.
- Use `<View3DProvider>` when 2D components must sit _beside_ the viewport (overlays, HUDs) — a `View3D` is a 2D display node and cannot contain 2D siblings.
- Because the provider owns the instance, `View3DOptions` (`width`, `height`, `toneMapping`, `environment`, `root`, ...) belong on `<View3DProvider>`, not on the `<View3D>` that mounts it. Passing options to a provider-owned `<View3D>` logs a DEV warning.
- Ownership: `<View3D>` / `<View3DProvider>` destroy the view they created; `as={view}` opts out, and combining `as` with a provider throws.
- `useView3D`, `useWorldToScreen`, and `useScreenToWorld` all read that context and throw if called outside a `<View3D>` or `<View3DProvider>`.

```tsx
// Shared viewport: 3D scene plus sibling 2D overlay
<View3DProvider width={800} height={600} toneMapping="aces">
  <View3D>
    <Camera3D z={6} />
    <Mesh3D geometry={geometry} material={material} />
  </View3D>
  <HealthBar /> {/* same View3D, no ref passing */}
</View3DProvider>

// Standalone viewport: <View3D> creates and owns the View3D
<View3D width={800} height={600}>
  <Camera3D z={6} />
</View3D>
```

## Import cost

`pixi-solid-3d` is an **all-or-nothing dependency on `@pixi/3d`**. Importing any single
component pulls the whole 3D engine (346 modules, 504 KB minified, 150 KB gzip for one
`Mesh3D` import). `@pixi/3d`'s entry side-effect-imports every subsystem barrel plus an `init`
module that mutates Pixi's global extension registries, so bundlers cannot tree-shake it.

Do not attempt deep imports like `@pixi/3d/dist/scene/Mesh3D.mjs` — `@pixi/3d` exposes only
`.`, `./extras`, `./webgl`, and `./webgpu`, and the shipped `dist` contains circular imports
that make filesystem-path imports order-dependent.

Tell users who do not need 3D to install `pixi-solid` alone; it has no `@pixi/3d` dependency.

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

| Area                   | Exports                                                                                                                  | Description                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| **Viewport & Context** | `<View3D>`, `View3DProvider`, `useView3D`, `useWorldToScreen`, `useScreenToWorld`                                        | 2D/3D bridge container, context accessor, and projection hooks |
| **Scene Nodes**        | `<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>`, `<ParticleSystem3D>` | 3D transform nodes & GPU particles                             |
| **Cameras & Controls** | `<Camera3D>`, `<OrbitCamera>`, `<FPSCamera>`                                                                             | Perspective/orthographic cameras, orbit and FPS controls       |
| **Materials**          | `<Material3D>`, `<FlatMaterial>`, `<PhongMaterial>`, `<ToonMaterial>`                                                    | Declarative materials with auto-disposal                       |
| **Geometries**         | `<CubeGeometry>`, `<SphereGeometry>`, `<PlaneGeometry>`, `<CylinderGeometry>`, etc.                                      | Declarative shapes with auto-disposal                          |
| **Lighting**           | `<DirectionalLight>`, `<PointLight>`, `<AmbientLight>`, `<SpotLight>`                                                    | Real-time scene lights                                         |
| **Utils**              | `traverse3D`                                                                                                             | Depth-first 3D scene traversal                                 |
| **Testing**            | Import directly from `pixi-solid/testing` (`mountScene`, `getByLabel`, `cleanup`)                                        | Headless testing utilities                                     |
