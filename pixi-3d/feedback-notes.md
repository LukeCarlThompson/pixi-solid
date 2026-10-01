# Feedback Notes for @pixi/3d

This document records architectural observations, developer experience friction points, and feature recommendations gathered while building `pixi-solid-3d` against `@pixi/3d` (`0.1.0-beta.1`).

---

## 1. Scene Traversal Method on `Container3D` (`traverse` / `traverse3D`)

### The Problem

In 3D engines (such as Three.js / React Three Fiber), inspecting or modifying sub-trees in a loaded glTF model (e.g. replacing materials, enabling shadow casting/receiving, inspecting node names, or attaching physics colliders) is one of the most common tasks.

Currently, `Container3D` in `@pixi/3d` does not have a built-in `traverse` or `walk` method:

- Developers must write their own recursive function every time they need to iterate through children of a `Model3D` or `Container3D`.
- Internal methods like `collectMaterials` in `Model3D.ts` already do depth-first tree walking manually.

### Recommendation

Add a native `traverse` method to `Container3D`:

```ts
class Container3D {
  /**
   * Executes a callback on this container and all of its descendants recursively in depth-first order.
   * @param callback - Function invoked for this container and each descendant.
   */
  public traverse(callback: (node: Container3D) => void): void {
    callback(this);
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      children[i].traverse(callback);
    }
  }
}
```

---

## 2. Shared Materials vs Per-Instance Property Mutation on `Model3D`

### The Problem

When `Model3D` instantiates meshes from a `Scene3DSource`, all meshes reference the shared `source.materials` array.

- If a developer changes `mesh.material.roughness = 0.9` on a single enemy model, **every other model instantiated from that source also changes**.
- Replacing a material (`mesh.material = new Material3D(...)`) is safe and per-instance, but mutating material properties writes through to the shared asset.

### Recommendation

Document this clearly or consider adding a helper like `model.cloneMaterial(nodeOrLabel)` or `model.cloneMaterials()` when a user wants an independent material instance that can be uniquely tinted or animated per model.

---

## 3. `View3D` Event Dispatching on Child Leaves

### The Problem

`View3D` separates 2D stage placement (`ViewContainer`) from 3D scene content (`view.root`).
In `@pixi/3d`, `View3D` listens to Pixi's 2D federated events and casts rays via `EventBoundary3D`.

- Leaves like `Sprite3D` or `Mesh3D` receive 3D pointer events when `eventMode = 'static'`, but require that `View3D` has run an initial render/transform update so that world transforms and raycast hit boxes are populated.
- When mounted in headless test environments (without an active WebGL/WebGPU canvas render loop), calling `view._onRender()` or stepping the ticker is required to prime picking coordinates.

---

## 4. Dual Constructor Forms for `Sprite3D`

### The Problem

`Sprite3DOptions` is split into `TextureForm | MaterialForm` with `never` markers. If a user passes both `texture` and `material`, `@pixi/3d` logs a warning and silently ignores the texture in favor of the material.
In declarative wrappers (like JSX), having separate setter props for `material` and `texture` is easier to reason about when `Sprite3D` exposes consistent properties.

---

## 5. Package Is Not Tree-Shakeable (No Partial Imports)

### The Problem

Importing a single class from `@pixi/3d` pulls in the entire engine. There is no way for a consumer to pay only for what it uses.

Measured with esbuild 0.28.2 (`pixi.js` external, `--bundle --minify`):

| Entry                                                               | Modules pulled | Minified | Gzip   |
| ------------------------------------------------------------------- | -------------- | -------- | ------ |
| `import { Mesh3D } from "@pixi/3d"`                                 | 346            | 504 KB   | 150 KB |
| `import { Mesh3D } from ".../scene/Mesh3D.mjs"` (deep, unsupported) | 26             | 56 KB    | 16 KB  |
| `import { View3D } from ".../scene/View3D.mjs"` (deep, unsupported) | 142            | 272 KB   | 77 KB  |

Four independent blockers, each of which has to be fixed before tree shaking works:

**a) The public entry is an eager barrel.** `dist/index.mjs` contains 323 `import` statements, including bare side-effect imports of every subsystem barrel:

```js
import "./core/index.mjs";
import "./events/index.mjs";
import "./materials/index.mjs";
import "./scene/index.mjs";
import "./init.mjs";
```

**b) `init.mjs` has real global side effects.** It calls `addUniformParsers()` and `extensions.add({ ... ExtensionType.WebGLLoader ... })` at module scope, and it is imported eagerly by `index.mjs`. Those calls mutate Pixi's global uniform-parser and extension registries, so no bundler may drop them. This is not a metadata problem: re-bundling with esbuild's `--ignore-annotations` (which ignores `package.json#sideEffects` for every package) produced a _larger_ result (528 KB vs 504 KB), because the retained bytes come from genuine top-level statements, not annotations.

**c) `exports` blocks all deep entry points.** Only `.`, `./extras`, `./webgl`, and `./webgpu` are exposed, so the natural escape hatch fails:

```text
@pixi/3d/dist/scene/Mesh3D.mjs -> ERR_PACKAGE_PATH_NOT_EXPORTED
```

**d) The emitted module graph contains circular imports, so deep imports are order-dependent.** Confirmed cycle, found by walking the emitted `dist` graph:

```text
core/shader/createLightingBit.mjs
  -> scene/View3D.mjs                      (bare import added by the bundler)
   -> scene/Model3D.mjs
    -> materials/pbr/Material3D.mjs
     -> materials/pbr/bits/pbrLightingBit.mjs
      -> core/shader/createLightingBit.mjs  (re-entrant)
```

The consequence: importing `core/shader/createLightingBit.mjs` directly throws `Cannot access 'GL_GET_LIGHT_HELPER' before initialization` (TDZ on a module-scope `const`), because `pbrLightingBit.mjs` calls `createLightingBit({ ... })` at module scope while `createLightingBit.mjs` is still mid-evaluation. Importing `scene/Mesh3D.mjs` first and then `createLightingBit.mjs` succeeds. Likewise, `@pixi/3d/extras` cannot be evaluated on its own — `import ".../dist/extras/index.mjs"` throws `ReferenceError: Cannot access 'GL_GET_LIGHT_HELPER' before initialization` unless `dist/index.mjs` is imported first. Our library works around this by placing a bare `import "@pixi/3d";` in its own entry module, which is fragile and undocumented for users.

### Why This Matters

Bundle size is the dominant cost for a 3D library. A consumer who only needs `<View3D>` + `<Mesh3D>` currently ships the animation system, the glTF asset pipeline, the shadow cascades, the post-processing passes, and the full PBR material stack.

### Recommendation

1. **Remove the eager barrels.** Make `dist/index.mjs` a pure re-export surface with no bare side-effect imports, and drop `import "./init.mjs"` from it. Move initialization to an explicit, documented entry point (e.g. `@pixi/3d/init`), or guard it behind the existing `./webgl` and `./webgpu` subpath entries.
2. **Break the `createLightingBit` ↔ `View3D` cycle.** `createLightingBit.mjs` imports `MAX_LIGHTS` from `scene/View3D.mjs`, which transitively drags in the whole material system. Move `MAX_LIGHTS`, `FLOATS_PER_LIGHT`, and the other constants into `core/` (e.g. `core/constants.ts`) so the shader-bit layer does not depend on the scene layer.
3. **Publish per-feature subpath entries.** `@pixi/3d/scene`, `@pixi/3d/materials`, `@pixi/3d/geometry`, `@pixi/3d/extras/*`, etc. This gives consumers a supported partial-import path even before the barrel and cycle work lands.
4. **Audit `sideEffects`.** The current array marks `./dist/index.*` as side-effectful, which is accurate but permanent: any consumer that imports anything from the package keeps the full entry. Once the `init` work is split out, this can become an empty array or a narrow list.
5. **Add a bundle-size budget to CI.** `test:bundle` (`scripts/build/check-split.mts`) already exists; extending it to assert that a minimal `{ Mesh3D }` import stays under a byte threshold would prevent regressions.
