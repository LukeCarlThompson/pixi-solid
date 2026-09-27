---
name: asset-loading
description: Patterns for loading PixiJS assets for pixi-solid components. Covers async memos, manifests, bundles, and scene-gated rendering.
---

# Loading assets for pixi-solid

PixiJS `Assets` is not exported by `pixi-solid`. Use PixiJS to load resources, then pass them to pixi-solid components. Neither component cleanup nor discarding a loading computation unloads assets from PixiJS's shared cache.

## Load one asset

Solid 2 removed `createResource`. Async is now "any computation that returns a Promise": return one from `createMemo` and read it inside a `<Loading>` boundary, which renders its `fallback` until the read settles. Mount this component under `PixiCanvas` or another application provider:

```tsx
import { createMemo, Loading } from "solid-js";
import { Assets, Texture } from "pixi.js";
import { Sprite, Text } from "pixi-solid";

function HeroScene() {
  const texture = createMemo(() => Assets.load<Texture>("/images/hero.png"));

  return (
    <Loading fallback={<Text text="Loading…" />}>
      <Sprite label="hero" texture={texture()} />
    </Loading>
  );
}
```

`Assets.load()` does not require `Assets.init()` for a direct URL. Keep the loading boundary at the route or scene level: load its resources together, then render display components with loaded values. Avoid adding a separate boundary to every `Sprite`. Async errors flow to an `<Errored>` boundary instead of an inline `resource.error`.

### How `<Loading>` behaves

`<Loading>` renders its `fallback` while a read inside its subtree is pending. While it waits, the children are **not** constructed: the pending read throws, the boundary discards that attempt, and the children are built once when the read settles. No half-built Pixi objects survive.

`fallback` is optional. Without one, the boundary renders nothing while pending, which makes `<Loading>` a direct replacement for the old `Show when={undefined}` pattern.

Inside a Pixi tree the `fallback` must be a Pixi element, or nothing at all. A DOM element such as `<div>` is not a Pixi object, so pixi-solid rejects it as a child and the error halts reactivity. Keep a DOM fallback outside `PixiCanvas`, where it is a sibling of the canvas rather than a child of the scene:

```tsx
// DOM fallback: the boundary wraps the canvas.
<Loading fallback={<div>Loading…</div>}>
  <Show when={assetsReady()}>
    <PixiCanvas>
      <Scene />
    </PixiCanvas>
  </Show>
</Loading>

// Pixi fallback: the boundary lives inside the scene.
<Loading fallback={<Text text="Loading…" />}>
  <Sprite texture={texture()} />
</Loading>
```

The boundary covers its **whole subtree** and catches a pending read from any descendant. Place it around the smallest subtree that should wait, and never wrap a subtree that belongs to your caller. A provider or wrapper whose children are the caller's should gate its own computation narrowly instead:

```tsx
import { createMemo, Show } from "solid-js";

// `loadingValue` supplies the value to read while the computation is pending, so the read
// returns that value instead of suspending. `Show` then gates only this computation.
const app = createMemo<Pixi.Application | undefined>(
  async (): Promise<Pixi.Application> => createApp(),
  { loadingValue: undefined },
);

return <Show when={app()}>{(resolvedApp) => <Contents app={resolvedApp} />}</Show>;
```

## Load scene bundles

For larger pipelines, PixiJS [AssetPack](https://pixijs.io/assetpack/) can generate manifests. It is optional and independent of pixi-solid.

Avoid mixing asset loading logic inside render-heavy Pixi components. Prefer to:

- Load assets in a parent component or route-level component.
- Pass the loaded assets (or aliases) as props to scene components.
- Keep scene components focused on display and interaction logic.

```tsx
import { createMemo, Loading, Show } from "solid-js";
import { Assets, Texture } from "pixi.js";
import { PixiCanvas, Sprite, Text } from "pixi-solid";

const manifest = {
  bundles: [
    {
      name: "menu",
      assets: [{ alias: "menu-bg", src: "/images/menu.png" }],
    },
  ],
};

function App() {
  const initialized = createMemo(async () => {
    await Assets.init({ manifest });
    return true;
  });

  return (
    <Loading fallback={<Text text="Loading…" />}>
      <Show when={initialized()}>
        <PixiCanvas style={{ width: "100%", height: "100vh" }}>
          <MenuRoute />
        </PixiCanvas>
      </Show>
    </Loading>
  );
}

function MenuRoute() {
  const ready = createMemo(async () => {
    await Assets.loadBundle("menu");
    return true;
  });

  return (
    <Loading fallback={<Text text="Loading…" />}>
      <Show when={ready()}>
        <MenuScene />
      </Show>
    </Loading>
  );
}

function MenuScene() {
  return <Sprite texture={Assets.get<Texture>("menu-bg")} />;
}
```

`Assets.init()` resolves to `void` and `Assets.loadBundle()` resolves to the loaded resources. Returning `true` gives `<Show>` a truthy value to render on. The pending read inside `<Loading>` shows the fallback until the memo settles.

## Cache keys and ownership

`Assets.get()` uses the same key used to register or load an asset. For bundle assets, use the manifest alias. For a direct `Assets.load(url)`, use the URL unless you registered an alias.

pixi-solid does not own PixiJS assets and does not call `Assets.unload()` when a Sprite unmounts. Keep shared assets loaded while any scene uses them. Unload an exclusive bundle with PixiJS `Assets.unloadBundle()` when it is no longer needed.
