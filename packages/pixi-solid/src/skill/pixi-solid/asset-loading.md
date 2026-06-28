---
name: pixi-solid-asset-loading
description: Patterns for loading and managing assets with pixi-solid. Covers createResource, PixiJS manifests, bundle loading, and scene-gated asset patterns.
metadata:
  triggers: "pixi-solid asset, pixi-solid load, pixi-solid preload, pixi-solid manifest, pixi-solid bundle, createResource, Assets.load, Assets.loadBundle, texture loading pixi-solid"
---

# Asset loading with pixi-solid

This subskill covers patterns for loading textures, spritesheets, and other assets when using `pixi-solid`. It integrates PixiJS's asset system with SolidJS's reactive primitives.

## Import

```ts
import { Assets } from "pixi.js";
import { createResource, Show } from "solid-js";
```

## Loading a single asset

For small scenes or individual assets, use Solid's `createResource` to load the asset and gate rendering with `<Show>`:

```tsx
import { createResource, Show } from "solid-js";
import { Assets, Texture } from "pixi.js";
import { Sprite } from "pixi-solid";

const [texture] = createResource(() => Assets.load<Texture>("https://example.com/my-texture.png"));

<Show when={texture()}>
  <Sprite texture={texture()!} />
</Show>
```

`createResource` returns a reactive signal that resolves when the asset loads. The `<Show>` wrapper ensures the `Sprite` is only mounted once the texture is ready.

## Loading with manifests and bundles

For larger apps, use PixiJS asset manifests and bundle loading to organise assets by scene or feature.

### 1. Generate a manifest (preferred: with AssetPack)

In production projects, use [AssetPack](https://pixijs.io/assetpack/) to generate manifests automatically rather than writing them by hand.

### 2. Init the manifest and load bundles on demand

```tsx
// In a root component or early in the app
await Assets.init({ manifest });
```

Then in a scene-level component, load only the bundle you need:

```tsx
function MenuScene() {
  const [assets] = createResource(() => Assets.loadBundle("menu-scene"));

  return (
    <Show when={assets()}>
      <Sprite texture="menu-bg" />
      <Sprite texture="play-btn" />
    </Show>
  );
}
```

This keeps loading focused — the game-scene textures aren't fetched until the user navigates to that scene.

## Accessing loaded assets from the cache

Once an asset is loaded (via `Assets.load` or `Assets.loadBundle`), PixiJS caches it by alias. You can access it synchronously anywhere in your app:

```tsx
import { Assets, Texture } from "pixi.js";

const texture = Assets.get("player"); // Texture | null
```

This is useful for assets loaded by a parent or provider — children can reference them by alias without awaiting them again.

## Keeping asset loading separate from scene rendering

Avoid mixing asset loading logic inside render-heavy Pixi components. Prefer to:

- Load assets in a parent component or route-level component.
- Pass the loaded assets (or aliases) as props to scene components.
- Keep scene components focused on display and interaction logic.

```tsx
// Good: loading is handled by the parent
function GameScreen() {
  const [assets] = createResource(() => Assets.loadBundle("game-scene"));

  return (
    <Show when={assets()}>
      <GameScene />
    </Show>
  );
}

function GameScene() {
  // Assets are already cached — just reference by alias
  return <Sprite texture="player" />;
}
```

## Full example: scene-based loading

```tsx
import { Assets } from "pixi.js";
import { createResource, Show, Switch, Match } from "solid-js";
import { PixiCanvas, Container, Sprite } from "pixi-solid";

const manifest = {
  bundles: [
    {
      name: "intro",
      assets: [
        { alias: "logo", src: "textures/logo.png" },
        { alias: "bg", src: "textures/background.png" },
      ],
    },
    {
      name: "gameplay",
      assets: [
        { alias: "hero", src: "sprites/hero.json" },
        { alias: "tiles", src: "textures/tileset.png" },
      ],
    },
  ],
};

// Init once at app startup
await Assets.init({ manifest });

function App() {
  const [scene, setScene] = createSignal("intro");

  return (
    <PixiCanvas background="#000">
      <Switch>
        <Match when={scene() === "intro"}>
          <IntroScene onStart={() => setScene("gameplay")} />
        </Match>
        <Match when={scene() === "gameplay"}>
          <GameplayScene />
        </Match>
      </Switch>
    </PixiCanvas>
  );
}

function IntroScene(props: { onStart: () => void }) {
  const [assets] = createResource(() => Assets.loadBundle("intro"));

  return (
    <Show when={assets()}>
      <Container>
        <Sprite texture="bg" />
        <Sprite texture="logo" x={100} y={50} />
      </Container>
    </Show>
  );
}

function GameplayScene() {
  const [assets] = createResource(() => Assets.loadBundle("gameplay"));

  return (
    <Show when={assets()}>
      <Sprite texture="hero" />
    </Show>
  );
}
```
