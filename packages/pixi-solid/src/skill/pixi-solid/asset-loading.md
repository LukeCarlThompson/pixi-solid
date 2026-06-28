---
name: asset-loading
description: Patterns for loading and managing assets with pixi-solid. Covers createResource, PixiJS manifests, bundle loading, and scene-gated asset patterns.
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

function MySprite() {
  const [texture] = createResource(() => Assets.load<Texture>("https://example.com/my-texture.png"));

  return (
    <Show when={texture()}>
      <Sprite texture={texture()!} />
    </Show>
  );
}
```

`createResource` returns a reactive signal that resolves when the asset loads. The `<Show>` wrapper ensures the `Sprite` is only mounted once the texture is ready. The resource is created inside the component so it's properly scoped and cleaned up on unmount.

## Loading with manifests and bundles

For larger apps, use PixiJS asset manifests and bundle loading to organise assets by scene or feature.

### 1. Generate a manifest (preferred: with AssetPack)

In production projects, use [AssetPack](https://pixijs.io/assetpack/) to generate manifests automatically rather than writing them by hand.

### 2. Init the manifest and load bundles on demand

Initialise the manifest and load a bundle together inside a single `createResource`. Return `true` so the signal is truthy when done:

```tsx
import { Assets, Texture } from "pixi.js";
import { createResource, Show } from "solid-js";
import { Sprite } from "pixi-solid";

const manifest = {
  bundles: [
    {
      name: "menu-scene",
      assets: [
        { alias: "menu-bg", src: "textures/menu-bg.png" },
        { alias: "play-btn", src: "textures/play-btn.png" },
      ],
    },
  ],
};

function MenuScene() {
  const [ready] = createResource(async () => {
    await Assets.init({ manifest });
    await Assets.loadBundle("menu-scene");
    return true;
  });

  return (
    <Show when={ready()}>
      <Sprite texture={Assets.get<Texture>("menu-bg")} />
      <Sprite texture={Assets.get<Texture>("play-btn")} />
    </Show>
  );
}
```

This keeps loading focused — the game-scene textures aren't fetched until the user navigates to that scene.

## Accessing loaded assets from the cache

Once an asset is loaded (via `Assets.load` or `Assets.loadBundle`), PixiJS caches it by alias. You can access it synchronously anywhere in your app:

```tsx
import { Assets, Texture } from "pixi.js";

const texture = Assets.get<Texture>("player");
```

This is useful for assets loaded by a parent or provider — children can reference them by alias without awaiting them again.

## Keeping asset loading separate from scene rendering

Avoid mixing asset loading logic inside render-heavy Pixi components. Prefer to:

- Load assets in a parent component or route-level component.
- Pass the loaded assets (or aliases) as props to scene components.
- Keep scene components focused on display and interaction logic.

```tsx
import { Assets, Texture } from "pixi.js";
import { createResource, Show } from "solid-js";
import { Sprite } from "pixi-solid";

// Good: loading is handled by the parent
function GameScreen() {
  const [ready] = createResource(async () => {
    await Assets.loadBundle("game-scene");
    return true;
  });

  return (
    <Show when={ready()}>
      <GameScene />
    </Show>
  );
}

function GameScene() {
  // Assets are already cached — retrieve via Assets.get
  return <Sprite texture={Assets.get<Texture>("player")} />;
}
```

## Full example: scene-based loading

```tsx
import { Assets, Texture } from "pixi.js";
import { createResource, createSignal, Show, Switch, Match } from "solid-js";
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

function App() {
  const [scene, setScene] = createSignal("intro");
  // Assets.init returns void, so we return true so the signal is truthy when ready
  const [initialised] = createResource(async () => {
    await Assets.init({ manifest });
    return true;
  });

  return (
    <Show when={initialised()}>
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
    </Show>
  );
}

function IntroScene(props: { onStart: () => void }) {
  const [ready] = createResource(async () => {
    await Assets.loadBundle("intro");
    return true;
  });

  return (
    <Show when={ready()}>
      <Container>
        <Sprite texture={Assets.get<Texture>("bg")} />
        <Sprite texture={Assets.get<Texture>("logo")} x={100} y={50} />
      </Container>
    </Show>
  );
}

function GameplayScene() {
  const [ready] = createResource(async () => {
    await Assets.loadBundle("gameplay");
    return true;
  });

  return (
    <Show when={ready()}>
      <Sprite texture={Assets.get<Texture>("hero")} />
    </Show>
  );
}
```
