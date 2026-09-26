---
name: asset-loading
description: Patterns for loading PixiJS assets for pixi-solid components. Covers createResource, manifests, bundles, and scene-gated rendering.
---

# Loading assets for pixi-solid

PixiJS `Assets` and SolidJS `createResource` are not exported by `pixi-solid`. Use PixiJS to load resources, then pass them to pixi-solid components. Neither component cleanup nor disposing a Solid resource unloads assets from PixiJS's shared cache.

## Load one asset

Use a Solid resource to gate mounting until texture is ready. Mount this component under `PixiCanvas` or another application provider:

```tsx
import { createResource, Show } from "solid-js";
import { Assets, Texture } from "pixi.js";
import { Sprite } from "pixi-solid";

function HeroScene() {
  const [texture] = createResource(() => Assets.load<Texture>("/images/hero.png"));

  return (
    <Show when={texture()}>{(loadedTexture) => <HeroSprite texture={loadedTexture()} />}</Show>
  );
}

function HeroSprite(props: { texture: Texture }) {
  return <Sprite texture={props.texture} />;
}
```

`Assets.load()` does not require `Assets.init()` for a direct URL. Keep the loading boundary at the route or scene level: load its resources together, then render display components with loaded values. Avoid adding separate resources and loading gates to every `Sprite`. A failed load is available through the resource's `error` accessor; add an error or loading state if your UI needs one.

## Load scene bundles

For larger pipelines, PixiJS [AssetPack](https://pixijs.io/assetpack/) can generate manifests. It is optional and independent of pixi-solid.

Avoid mixing asset loading logic inside render-heavy Pixi components. Prefer to:

- Load assets in a parent component or route-level component.
- Pass the loaded assets (or aliases) as props to scene components.
- Keep scene components focused on display and interaction logic.

```tsx
import { createResource, Show } from "solid-js";
import { Assets, Texture } from "pixi.js";
import { PixiCanvas, Sprite } from "pixi-solid";

const manifest = {
  bundles: [
    {
      name: "menu",
      assets: [{ alias: "menu-bg", src: "/images/menu.png" }],
    },
  ],
};

function App() {
  const [initialized] = createResource(async () => {
    await Assets.init({ manifest });
    return true;
  });

  return (
    <Show when={initialized()}>
      <PixiCanvas style={{ width: "100%", height: "100vh" }}>
        <MenuRoute />
      </PixiCanvas>
    </Show>
  );
}

function MenuRoute() {
  const [ready] = createResource(async () => {
    await Assets.loadBundle("menu");
    return true;
  });

  return (
    <Show when={ready()}>
      <MenuScene />
    </Show>
  );
}

function MenuScene() {
  return <Sprite texture={Assets.get<Texture>("menu-bg")} />;
}
```

`Assets.init()` resolves to `void`; `Assets.loadBundle()` resolves to loaded resources. Returning `true` makes each resource truthy for `<Show>` after loading.

## Cache keys and ownership

`Assets.get()` uses the same key used to register or load an asset. For bundle assets, use the manifest alias. For a direct `Assets.load(url)`, use the URL unless you registered an alias.

pixi-solid does not own PixiJS assets and does not call `Assets.unload()` when a Sprite unmounts. Keep shared assets loaded while any scene uses them. Unload an exclusive bundle with PixiJS `Assets.unloadBundle()` when it is no longer needed.
