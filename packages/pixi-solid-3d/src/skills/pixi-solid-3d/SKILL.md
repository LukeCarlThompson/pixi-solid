---
name: pixi-solid-3d
description: Use when building 3D scenes and components with pixi-solid-3d. Covers 3D JSX components, vector props, cameras, lighting, materials, and testing patterns.
metadata:
  triggers: "pixi-solid-3d, pixi-solid 3d, View3D, Container3D, Mesh3D, Model3D, OrbitCamera, @pixi/3d"
---

# Pixi-solid-3d guidelines

Use this skill for `pixi-solid-3d` APIs and scene integration. It extends `pixi-solid` with 3D components powered by `@pixi/3d` and `pixi.js` (v8).

## Versions

`pixi-solid-3d` requires `@pixi/3d` 0.1.0 or later and `pixi.js` 8.23.0 or later. `@pixi/3d` declares `pixi.js ^8.23.0` as a peer, so an older `pixi.js` can fail at runtime.

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

### Per-model materials

By default every `Model3D` built from one `Scene3DSource` draws the **same** material instances, so writing `mesh.material.roughness = 0.9` changes every model made from that source. Give the model its own materials with `materials` instead:

```tsx
// By material label (glTF material names)
<Model3D source={src()} materials={{ Paint: redPaint }} />

// By source material index; an empty entry keeps the source's material
<Model3D source={src()} materials={[undefined, glowMaterial]} />

// One call per source material, so meshes that shared a material still share its replacement
<Model3D source={src()} materials={(material) => material.clone()} />
```

`materials` is a setter on `Model3D`, so a signal works. Passing `undefined` puts the source's materials back. The component never destroys the materials you pass in.

### Walking model nodes

Use `traverse` on `<Model3D>`, or call `Container3D.traverse` on any node:

```tsx
<Model3D
  source={src()}
  traverse={(node) => {
    if (node instanceof Mesh3D) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  }}
/>
```

## Event handler props

3D event props are lowercase, matching `pixi-solid`: `onclick`, `onpointerdown`, `onwheel`, `oncontextmenu`, `onpointerdowncapture`, `onglobalpointermove`, and so on. The set comes from `@pixi/3d`'s `FederatedEventEmitterTypes3D`, and the event object carries the 3D fields (`e.hit3D.point`, `e.hit3D.uv`) alongside Pixi's 2D ones.

## Viewport options

Every `View3DOptions` key is accepted on `<View3D>` or `<View3DProvider>` and applied reactively. The ones you reach for most:

| Option                           | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `width` / `height`               | Viewport size in pixels                                      |
| `autoResize`                     | Follow the renderer's screen size                            |
| `toneMapping`                    | `'none'`, `'aces'`, `'reinhard'`, `'uncharted2'`, `'custom'` |
| `exposure`                       | Exposure multiplier before tone mapping                      |
| `environment`                    | Sky/ground colours or a cube map that lights the scene       |
| `fog`                            | `{ type: 'linear' \| 'exponential' \| 'exp2', ... }`         |
| `cull`                           | `'off'`, `'cpu'` or `'gpu'` frustum culling                  |
| `shadowQuality` / `shadowFilter` | Shadow map size and filter                                   |
| `resolution`                     | Texels per logical pixel, or `'inherit'`                     |
| `passes`                         | Post effects and passes; the array is copied                 |

## Instancing with `<BatchedMesh3D>`

For thousands of copies of one geometry, `<BatchedMesh3D>` draws them without a node each:

```tsx
<BatchedMesh3D
  size={count}
  ref={(batch) => {
    for (let i = 0; i < count; i++) {
      batch.setGeometryAt(i, geometry);
      batch.setMaterialAt(i, material);
      batch.setMatrixAt(i, matrix);
      batch.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
    }
  }}
/>
```

`size` is required and fixed for the batch's lifetime. Hide a slot with `setVisibleAt(i, false)` to despawn it; there is no `setItemActive` any more. For per-slot shader values such as a tint, pass `instanceData` and write it with `setInstanceDataAt`.

## Single-renderer builds

`@pixi/3d` exposes `@pixi/3d/webgl` and `@pixi/3d/webgpu` for apps that only need one backend. `pixi-solid-3d` imports the full `@pixi/3d` entry, which runs the package's initialisation, so keep that import when you use both.

## Public API Checklist

| Area                   | Exports                                                                                                                  | Description                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| **Viewport & Context** | `<View3D>`, `View3DProvider`, `useView3D`, `useWorldToScreen`, `useScreenToWorld`                                        | 2D/3D bridge container, context accessor, and projection hooks |
| **Scene Nodes**        | `<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>`, `<ParticleSystem3D>` | 3D transform nodes & GPU particles                             |
| **Cameras & Controls** | `<Camera3D>`, `<OrbitCamera>`, `<FPSCamera>`                                                                             | Perspective/orthographic cameras, orbit and FPS controls       |
| **Materials**          | `<Material3D>`, `<FlatMaterial>`, `<PhongMaterial>`, `<ToonMaterial>`                                                    | Declarative materials with auto-disposal                       |
| **Geometries**         | `<CubeGeometry>`, `<SphereGeometry>`, `<PlaneGeometry>`, `<CylinderGeometry>`, etc.                                      | Declarative shapes with auto-disposal                          |
| **Lighting**           | `<DirectionalLight>`, `<PointLight>`, `<AmbientLight>`, `<SpotLight>`                                                    | Real-time scene lights                                         |
| **Utils**              | `Container3D.traverse`                                                                                                   | Depth-first 3D scene traversal                                 |
| **Testing**            | Import directly from `pixi-solid/testing` (`mountScene`, `getByLabel`, `cleanup`)                                        | Headless testing utilities                                     |

## Related skills

`@pixi/3d` 0.1.0 ships its own agent skill at `node_modules/@pixi/3d/skills/pixijs-3d/`. Read it for engine-level detail: materials, shadows, custom shaders, instancing, post-processing, and the Three.js migration guide.
