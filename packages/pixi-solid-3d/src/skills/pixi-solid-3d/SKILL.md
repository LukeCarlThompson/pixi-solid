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

Every 3D component (`<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Camera3D>`, lights) takes a single
axis at a time. **Prefer the axis props.** They update one component through one effect, and they
allocate nothing:

- **Position**: `x`, `y`, `z`, or `positionX`, `positionY`, `positionZ`
- **Scale**: `scaleX`, `scaleY`, `scaleZ`, or the uniform shorthand `scale={2}`
- **Rotation**: `rotationX`, `rotationY`, `rotationZ` (Euler radians), or `angleX`, `angleY`, `angleZ` (degrees)
- **Origin / Pivot**: `originX`, `originY`, `originZ`, or the uniform shorthand `origin={0}`
- **LookAt**: `lookAtX`, `lookAtY`, `lookAtZ`

The whole-object forms are for setting several axes at once: `position={{ x, y, z }}`,
`lookAt={{ x, y, z }}`, `quaternion={{ x, y, z, w }}`. Pass **all** the axes: the types require them,
and the object is allocated on every change, so it is the wrong tool inside a frame loop. Partial
objects are not part of the API even though the runtime would merge them.

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

## Props and instances

Pass `as={instance}` to adopt a `Container3D` you built yourself. The component then never destroys it, and you do not restate the constructor options: `<BatchedMesh3D as={batch} />` needs no `size`, and `<Model3D as={model} />` needs no `source`.

Some options belong to construction only, because the instance preallocates buffers around them. Updating one logs a warning in development and the new value is ignored:

| Component               | Option      | Why                                           |
| ----------------------- | ----------- | --------------------------------------------- |
| `<BatchedMesh3D>`       | `size`      | Slots are allocated once                      |
| `<ParticleContainer3D>` | `capacity`  | Particle buffers are allocated once           |
| `<ParticleContainer3D>` | `billboard` | Read back as `billboardMode`, always `'none'` |

To change any of these, remount with a different `key` so a new instance is built.

## Event handler props

3D event props are lowercase, matching `pixi-solid`: `onclick`, `onpointerdown`, `onwheel`, `oncontextmenu`, `onpointerdowncapture`, `onglobalpointermove`, and so on. The set comes from `@pixi/3d`'s `FederatedEventEmitterTypes3D`, and the event object carries the 3D fields alongside Pixi's 2D ones.

A node only receives events with `eventMode="static"` (or `"dynamic"` for one that moves under a still pointer); the default `"passive"` is inert unless an interactive ancestor covers it. `e.hit3D` is `{ target, point, localPoint, distance, normal, uv, triangleIndex }` or `null`, and `normal`/`uv`/`triangleIndex` need `hitVolume="geometry"` — the default picks the bounding box. Pixi reuses event objects, so copy anything kept beyond the handler. `view.raycast({ x, y })` picks without dispatching.

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

## Post effects and passes

A pass runs on the whole view, so it is declared on the view and never from a nested component. Build
it with `@pixi/3d` and pass it in; the array order is the run order.

```tsx
const bloom = new BloomEffect({ intensity: 1.2, threshold: 0.8 });

<View3D width={800} height={600} passes={[bloom]}>
  …
</View3D>;
```

There is deliberately no `<Bloom>` component:

- a pass is view-wide, so a component that registered itself from anywhere would change content it
  does not own;
- `enabled` toggles a pass without rebuilding the graph, while reassigning `passes` does rebuild it;
- a wrapper per effect would duplicate upstream class names and option types and drift with them.

Tune effects through their setters in a `createEffect`, and toggle with `bloom.enabled = false`.
`levels` / `resolution` on `BloomEffect` are constructor-only. Only `ExtractPass` and `PortalPass` own
resources and need `destroy()`; the other effects' `destroy()` is a no-op because the view's graph owns
their targets.

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

## Particles

- `<ParticleSystem3D>` simulates particles for you. Lifetime, ballistic motion, size, alpha and colour over life, spin and flipbooks all come from its options.
- `<ParticleContainer3D>` is a pool of quads with no simulation. You write each slot, then call `upload()` once per frame.

```tsx
<ParticleSystem3D
  capacity={500}
  emitRate={80}
  life={[1, 2]}
  size={[0.3, 0.6]}
  speed={[3, 6]}
  blendMode="add"
/>
```

Both are built from _particle bits_: shader fragments that declare per-particle attributes and uniforms, so age, motion and fade run in the vertex shader instead of on the CPU. `<ParticleSystem3D>` derives the bits it needs from your options, so you never name one.

### `extraBits`

`extraBits` adds a bit beyond the built-in ones. On `<ParticleSystem3D>` that means a bit you wrote yourself, so it is an `@advanced` path you can ignore.

On `<ParticleContainer3D>` it is how you opt into GPU animation at all, since nothing is derived for you. Pass the bits and write their attributes with `setParticle`:

```tsx
const BITS = [particleLifetimeBit, particleMotionBit, particleSizeOverLifeBit] as const;

<ParticleContainer3D
  capacity={2000}
  texture={Texture.WHITE}
  blendMode="add"
  extraBits={BITS}
  ref={(particles) => {
    // Written once, at spawn: `aBirth`, `aLife`, `aVel` and `aSizeEnd` come from BITS.
    particles.setParticle(0, {
      aPosition: { x: 0, y: 0, z: 0 },
      aBirth: 0,
      aLife: 1.5,
      aVel: { x: 0, y: 2, z: 0 },
      aSizeEnd: 0,
    });
    particles.upload();
  }}
/>;
```

An unknown attribute throws at runtime and lists the attributes the bits declare.

### Running a system

`setParticle` takes an object, so use it to spawn, not to run. The bits animate each particle on the GPU from the attributes you wrote, so a frame only advances the clock:

```tsx
container.upload(); // once, after spawning
container.uniforms.uParticleTime = elapsed; // every frame, from `onTick`
```

For particles you move yourself, write scalars with `setParticleAt` or `writePacked`, or straight into the typed arrays in `container.data`, then call `upload()` once per frame. Those paths allocate nothing.

## 2D content on a 3D surface

`createContainerTexture` renders pixi-solid JSX into a texture any 3D material can sample. It is a
hook, not a component, because the result is a value, not a scene node.

```tsx
const label = createContainerTexture(
  <Container>
    <Text text="Hello" style={{ fontSize: 64 }} />
  </Container>,
  { width: 512, height: 128 },
);

<Mesh3D
  geometry={new PlaneGeometry({ width: 4, height: 1 })}
  material={new FlatMaterial({ baseColorTexture: label })}
/>;
```

Never use `new ContainerTexture(...)` directly: `@pixi/3d`'s version needs a renderer, attaches
`autoUpdate` to `Ticker.shared` rather than the ticker in scope, and leaves its render target for you
to free. The hook takes the renderer and ticker from context and destroys the texture on unmount.

The JSX argument arrives as a filled `Container`, since the parent component binds its own children.
It draws one container, so wrap several roots in a `<Container>`. Content is built once, so internal
`<Show>` / `<For>` stay reactive but the top-level tree does not rebuild. Pass `autoUpdate: false` for static content and call `texture.render()` after changes. The
image is stored flipped relative to an image texture: upright on a `PlaneGeometry`, inverted on a
sphere, a loaded model or a 2D sprite, where `scale.y = -1` with `anchor.y = 1` turns it over.

## Portals and render textures

`<PortalMaterial>` shows a render texture on a surface — a monitor, a teleporter face, or a portal.
The texture is yours to create, size and destroy.

```tsx
<Mesh3D geometry={geometry}>
  <PortalMaterial texture={feed} baseColor={0xbfdcff} />
</Mesh3D>
```

A real portal adds two quads and a pass: `entry` (the opening, drawn with `PortalMaterial`), `exit`
(the far side) and `PortalPass({ entry, exit, texture: feed })` in `passes`. The pass needs the mesh
instances at construction, so build them with `@pixi/3d`'s `Mesh3D` class and mount them with
`<Mesh3D as={entry} />`. Size the feed to the view and resize it with the view, give both quads the
same `scale`, and keep the view camera perspective and unrotated. `PortalPass` runs at
`'beforeOpaque'`, so its order in `passes` does not matter. `PortalFeedPass` is internal.

## Single-renderer builds

`@pixi/3d` exposes `@pixi/3d/webgl` and `@pixi/3d/webgpu` for apps that only need one backend. `pixi-solid-3d` imports the full `@pixi/3d` entry, which runs the package's initialisation, so keep that import when you use both.

## Public API Checklist

| Area                   | Exports                                                                                                                             | Description                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Viewport & Context** | `<View3D>`, `View3DProvider`, `useView3D`, `useWorldToScreen`, `useScreenToWorld`                                                   | 2D/3D bridge container, context accessor, and projection hooks |
| **Scene Nodes**        | `<Container3D>`, `<Mesh3D>`, `<Model3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>`, `<ParticleSystem3D>`            | 3D transform nodes & GPU particles                             |
| **Cameras & Controls** | `<Camera3D>`, `<OrbitCamera>`, `<FPSCamera>`                                                                                        | Perspective/orthographic cameras, orbit and FPS controls       |
| **Materials**          | `<Material3D>`, `<FlatMaterial>`, `<PhongMaterial>`, `<ToonMaterial>`                                                               | Declarative materials with auto-disposal                       |
| **Geometries**         | `<CubeGeometry>`, `<SphereGeometry>`, `<PlaneGeometry>`, `<CylinderGeometry>`, etc.                                                 | Declarative shapes with auto-disposal                          |
| **Lighting**           | `<DirectionalLight>`, `<PointLight>`, `<AmbientLight>`, `<SpotLight>`                                                               | Real-time scene lights                                         |
| **Utils**              | `Container3D.traverse`                                                                                                              | Depth-first 3D scene traversal                                 |
| **Testing**            | `mountScene`, `cleanup` from `pixi-solid/testing`; `getByLabel3D`, `queryByLabel3D`, `getAllByLabel3D` from `pixi-solid-3d/testing` | Headless testing; one query spans 2D and 3D                    |

### Prop names

Component props are `@pixi/3d`'s own option types, so the compiler rejects a name that does not
exist. A handful are elided rather than obvious, and worth knowing when reading the package:

- Geometry segment counts: `widthSegments` / `heightSegments` on spheres, planes, capsules.
- Texture slots read `baseColorTexture`, `normalTexture`, not `texture` / `normalMap`.
- Point and spot lights bound their reach with `range` and `radius`; a spot adds `coneAngle`,
  `penumbra`.
- `PlaneGeometry` lies in XY with a +Z normal, so a quarter turn on X makes it a floor.

## Related skills

`@pixi/3d` 0.1.0 ships its own agent skill at `node_modules/@pixi/3d/skills/pixijs-3d/`. Read it for engine-level detail: materials, shadows, custom shaders, instancing, post-processing, and the Three.js migration guide.
