# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 😵 Deprecated for soon-to-be removed features.
- 💀 Removed for now removed features.
- 🐞 Fixed for any bug fixes.

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
