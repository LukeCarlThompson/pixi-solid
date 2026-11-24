<div align="center">
  <img src="https://raw.githubusercontent.com/LukeCarlThompson/pixi-solid/main/packages/pixi-solid/pixi-solid-logo.png" alt="Pixi-Solid Logo" width="200" />

[![CI](https://github.com/LukeCarlThompson/pixi-solid/actions/workflows/ci.yml/badge.svg)](https://github.com/LukeCarlThompson/pixi-solid/actions)
[![Docs](https://img.shields.io/badge/docs-lukecarlthompson.github.io%2Fpixi--solid-blue)](https://lukecarlthompson.github.io/pixi-solid/)
[![License](https://img.shields.io/badge/license-MIT-blue)](./packages/pixi-solid/LICENSE)

</div>

# Pixi Solid

PixiJS renderers for [SolidJS](https://www.solidjs.com/): **`pixi-solid`** for 2D, **`pixi-solid-3d`** for
3D. Both build the scene graph out of JSX, so plain Solid signals drive PixiJS objects.

Both packages target SolidJS 2. `pixi-solid-3d` is still pre-1.0, so a `0.x` minor may break:
pin `^0.2.0` and read its changelog.

| Package                                     | Install                                                                 | What it covers                                                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`pixi-solid`](./packages/pixi-solid)       | `npm i pixi-solid pixi.js solid-js @solidjs/web`                        | Every major PixiJS display object as a component, all federated events as props, `pixi-solid/utils` animation and layout helpers, and `pixi-solid/testing` for headless tests. |
| [`pixi-solid-3d`](./packages/pixi-solid-3d) | `npm i pixi-solid-3d @pixi/3d pixi-solid pixi.js solid-js @solidjs/web` | Viewport, meshes, glTF models, lights, cameras, materials, geometries, particles and post effects, on top of [`@pixi/3d`](https://github.com/pixijs/3d). Pre-1.0.              |

Guides, live demos and the full API reference are at
**[lukecarlthompson.github.io/pixi-solid](https://lukecarlthompson.github.io/pixi-solid/)**.

## 2D

```tsx
import { PixiCanvas, Sprite } from "pixi-solid";
import { createSignal } from "solid-js";
import { Texture } from "pixi.js";

export const DemoApp = () => {
  const [scale, setScale] = createSignal(10);

  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
      <Sprite
        texture={Texture.WHITE}
        scale={scale()}
        tint="#ff0000"
        onpointertap={() => setScale((current) => current + 1)}
      />
    </PixiCanvas>
  );
};
```

## 3D

```tsx
import { PixiCanvas } from "pixi-solid";
import { Camera3D, CubeGeometry, Material3D, Mesh3D, View3D } from "pixi-solid-3d";

export const DemoApp = () => (
  <PixiCanvas style={{ width: "100%", height: "100vh" }}>
    <View3D width={800} height={600} toneMapping="aces">
      <Camera3D z={6} />
      <Mesh3D>
        <CubeGeometry />
        <Material3D baseColor={0x38bdf8} />
      </Mesh3D>
    </View3D>
  </PixiCanvas>
);
```

A `View3D` is an ordinary 2D display object that renders a 3D scene into its rectangle, which is why
`useWorldToScreen`, `useScreenToWorld` and `createContainerTexture` can pin 2D UI to 3D objects.

## Repository layout

```
packages/
  pixi-solid/      2D renderer, utils and testing entry
  pixi-solid-3d/   3D renderer on @pixi/3d, plus its testing entry
  pixi-solid-docs/ Astro + Starlight documentation site
.github/           CI, npm publish and docs deploy workflows
```

Each package has its own README with the full API tour. The docs site holds the guides and the demos
for both packages.

## Development

Node 22.21.1 and pnpm 12.4.1 (`corepack enable`).

```bash
pnpm install
pnpm build        # every package
pnpm test         # vitest, per package
pnpm typecheck
pnpm lint         # oxlint
pnpm fmt          # oxfmt
pnpm dev          # package dev servers
```

To work on the docs:

```bash
pnpm --filter pixi-solid-docs dev
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for conventions, component architecture and the release
process, and [PHILOSOPHY.md](./PHILOSOPHY.md) for the design principles behind the library.

## License

MIT. See `LICENSE` in each package.
