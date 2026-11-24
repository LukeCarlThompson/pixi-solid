# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 😵 Deprecated for soon-to-be removed features.
- 💀 Removed for now removed features.
- 🐞 Fixed for any bug fixes.

## 0.2.0

`pixi-solid-3d` 0.2 runs on SolidJS 2 and requires `pixi-solid` 2. The component names, props and
hooks are unchanged. Everything below is about the Solid version underneath.

### Changed

- ⚙️ `solid-js`, `@solidjs/web` and `pixi-solid` are peers at `>=2.0.0 <3`. SolidJS 1 is no longer supported.
- ⚙️ `ref` callbacks run once and outside the component owner, matching `pixi-solid` 2. Use a `createEffect` compute function, or the component's own props, to follow a signal.
- ⚙️ A context with no provider now reads `null` rather than throwing from Solid's own lookup. `useView3D` and `useMesh3D` still throw their own errors.
- ⚙️ `useWorldToScreen` and `useScreenToWorld` compute on read until the ticker has produced a value, so a sibling 2D component sees the camera on its first render.

### Fixed

- 🐞 A `<Camera3D>` becomes the view's camera as it mounts, so a sibling component that reads the view in the same pass no longer sees an unset camera.
- 🐞 `ParticleSystem3D` binds `autoUpdate` and `playing` through their own effects instead of writing a getter.

## 0.1.0

First release. Pre-1.0, so a minor version may break: pin `^0.1.0` and read these notes before taking
a `0.x` minor.

### Added

- ✅ `<View3D>` and `<View3DProvider>`, with `useView3D` for 2D components beside a viewport.
- ✅ Scene nodes: `<Container3D>`, `<Mesh3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>`.
- ✅ `<Model3D>` for glTF and GLB, with animation, per-model `materials` overrides and `traverse`.
- ✅ Lights: `<AmbientLight>`, `<DirectionalLight>`, `<PointLight>`, `<SpotLight>`, with shadows.
- ✅ Cameras: `<Camera3D>`, plus `<OrbitCamera>` and `<FPSCamera>` controllers that follow the ticker in
  context instead of `Ticker.shared`.
- ✅ Materials and geometry: `<Material3D>`, `<FlatMaterial>`, `<PhongMaterial>`, `<ToonMaterial>`,
  `<PortalMaterial>`, and nine geometry components, all disposed with the scene.
- ✅ `<ParticleSystem3D>` for simulated effects.
- ✅ Post-processing effects through the view's `passes`.
- ✅ Mixing 2D and 3D: `useWorldToScreen`, `useScreenToWorld`, and `createContainerTexture` for drawing
  2D content on a 3D surface.
- ✅ Pointer picking on meshes and sprites, with the hit point, normal and uv.
- ✅ `pixi-solid-3d/testing` with `getByLabel3D`, `queryByLabel3D` and `getAllByLabel3D`, which query
  2D and 3D nodes in one pass.
- ✅ An agent skill at `dist/skills/pixi-solid-3d/SKILL.md`.
