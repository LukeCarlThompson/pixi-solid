# pixi-solid-3d

Declarative 3D for SolidJS, powered by [`@pixi/3d`](https://github.com/pixijs/3d).

A `View3D` is an ordinary 2D display object that renders a 3D scene into its rectangle, so 3D and 2D
mix in one Solid component tree. Every 3D node is a component: props are reactive, and geometry,
materials and passes are created and disposed with the scene.

> **Pre-1.0.** The API may change between minor releases. Breaking changes ship as `0.x` bumps, which
> is what semver allows below 1.0, so pin `^0.1.0` and read the release notes before taking a `0.x`
> minor.

## What it covers

- **Scene graph**: `<View3D>`, `<View3DProvider>`, `<Container3D>`, `<Mesh3D>`, `<Sprite3D>`, `<BatchedMesh3D>`, `<ParticleContainer3D>`
- **Models**: `<Model3D>` for glTF and GLB, with animation and per-model material overrides
- **Lighting**: `<AmbientLight>`, `<DirectionalLight>`, `<PointLight>`, `<SpotLight>`, with shadows
- **Cameras**: `<Camera3D>` plus `<OrbitCamera>` and `<FPSCamera>` controls
- **Materials and geometry**: `<Material3D>`, `<PhongMaterial>`, `<ToonMaterial>`, `<FlatMaterial>`, `<PortalMaterial>`, and nine geometry components, all auto-disposed
- **Particles**: `<ParticleSystem3D>` for simulated effects, `<ParticleContainer3D>` for particles you drive
- **Post-processing**: bloom, SSAO, motion blur, tilt shift, tint, FXAA, outlines and wireframe, through the view's `passes`
- **2D and 3D together**: `useWorldToScreen`, `useScreenToWorld`, and `createContainerTexture` for rendering 2D UI onto a 3D surface
- **Pointer events**: picking on meshes and sprites, with the hit point, normal and UV

## Installation

`pixi-solid-3d` declares its host packages as peers, so you install them alongside it:

```bash
pnpm add pixi-solid-3d @pixi/3d pixi-solid pixi.js solid-js
```

`@pixi/3d` needs `pixi.js` 8.23.0 or later. Your bundler must read the `exports` field, so use a
`moduleResolution` of `bundler` or `node16`.

## Quick start

```tsx
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  PlaneGeometry,
  View3D,
} from "pixi-solid-3d";

const Scene = () => {
  const screen = usePixiScreen();

  return (
    <View3D width={screen.width} height={screen.height} toneMapping="aces" shadowQuality="medium">
      <Camera3D x={0} y={3} z={8} lookAt={{ x: 0, y: 1, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={4} maxDistance={20} />

      <AmbientLight intensity={0.3} />
      <DirectionalLight
        intensity={2.4}
        x={5}
        y={8}
        z={4}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      {/* PlaneGeometry lies in XY, so a quarter turn puts it under our feet. */}
      <Mesh3D rotationX={-Math.PI / 2} receiveShadow={true}>
        <PlaneGeometry width={20} height={20} />
        <Material3D baseColor={0x1e293b} roughness={0.9} />
      </Mesh3D>

      <Mesh3D y={1} castShadow={true}>
        <CubeGeometry width={2} height={2} depth={2} />
        <Material3D baseColor={0x4f88ea} roughness={0.3} />
      </Mesh3D>
    </View3D>
  );
};

export const App = () => (
  <PixiCanvas style={{ width: "100%", height: "100vh" }}>
    <Scene />
  </PixiCanvas>
);
```

## Testing

Scene tests run without a browser or canvas, using the utilities from `pixi-solid/testing`:

```tsx
import { cleanup, getByLabel, mountScene } from "pixi-solid/testing";
import { Mesh3D } from "pixi-solid-3d";

const { container } = mountScene(() => <Mesh3D label="crate" />);

expect(getByLabel(container, "crate")).toBeDefined();

cleanup();
```

## Agent skill

The package ships an agent skill at `dist/skills/pixi-solid-3d/SKILL.md`, covering components, props,
particles, passes and testing conventions.

## Documentation

Guides, live demos and an API reference: [pixi-solid docs](https://lukecarlthompson.github.io/pixi-solid/3d/overview/).

## License

MIT
