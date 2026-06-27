<div align="center">
  <img src="https://raw.githubusercontent.com/LukeCarlThompson/pixi-solid/main/packages/pixi-solid/pixi-solid-logo.png" alt="Pixi-Solid Logo" width="200" />

[![NPM Version](https://img.shields.io/npm/v/pixi-solid.svg)](https://www.npmjs.com/package/pixi-solid)
[![License](https://img.shields.io/npm/l/pixi-solid.svg)](https://github.com/LukeCarlThompson/pixi-solid/blob/main/packages/pixi-solid/LICENSE)
[![CI](https://github.com/LukeCarlThompson/pixi-solid/actions/workflows/ci.yml/badge.svg)](https://github.com/LukeCarlThompson/pixi-solid/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)

</div>

# Pixi-Solid

A custom renderer for [PixiJS](https://pixijs.com/) that lets you build your scene with [SolidJS](https://www.solidjs.com/) JSX components and its fine-grained signal-based reactivity.

- 📦 **Full component coverage** — Every major PixiJS display object has a corresponding component.
- ⚡ **Signals-driven reactivity** — State changes automatically update your scene.
- 🧹 **Automatic cleanup** — Components clean up after themselves on unmount (display objects, event listeners, ticker subscriptions, textures).
- 🧪 **Testable without a browser** — Context, hooks, and ticker are built for simulation. `pixi-solid/testing` provides mountScene, scene graph queries, and manual ticker helpers.
- ✨ **All PixiJS events supported** — Every federated event from PixiJS works as a component prop.
- 🛠️ **Utilities included** — Animation helpers (spring, smooth damp), layout (object-fit), and async timing. Available via `pixi-solid/utils`.
- 🤩 **Full TypeScript support** — Strict type safety and auto completion throughout the API.

## Install

```bash
npm i pixi-solid
```

Peer dependencies of

```json
{
  "pixi.js": ">=8.14.3 <9",
  "solid-js": ">=1.9.10 <2"
}
```

## Basic usage

```tsx
import { PixiCanvas, Sprite } from "pixi-solid";
import { createSignal } from "solid-js";
import { Texture } from "pixi.js";

export const DemoApp = () => {
  const [scale, setScale] = createSignal(10);

  const handleSpriteTap = () => {
    setScale((currentScale) => currentScale + 1);
  };

  return (
    <PixiCanvas style={{ width: "100%", height: "100vh" }} background="#1099bb">
      <Sprite
        texture={Texture.WHITE}
        scale={scale()}
        onpointerdown={handleSpriteTap}
        tint="#ff0000"
      />
    </PixiCanvas>
  );
};
```

## More information

- 📖 **[Documentation](https://lukecarlthompson.github.io/pixi-solid/)** — Getting started, components, hooks, utilities, and live examples.
- 🎮 **[Live Demo](https://lukecarlthompson.github.io/pixi-solid/)** — Interactive example on the docs homepage.
- 🐛 **[GitHub Issues](https://github.com/LukeCarlThompson/pixi-solid/issues)** — Report bugs or request features.

## Why combine SolidJS with PixiJS?

**Declarative scene graphs.** Compose PixiJS objects with JSX instead of imperative `addChild`/`removeChild` calls. The tree is your scene.

**Automatic lifecycle.** Components clean up after themselves on unmount — display objects, event listeners, ticker subscriptions, textures. No manual disposal tracking.

**Shared reactivity.** Signals and stores drive both canvas content and HTML UI from the same state. No bridging layer or two-way sync required.

**Unified timing.** Animations, frame callbacks, and sprite updates all synchronise to the same ticker context. No timing drift between `onTick`, `useSpring`, or `AnimatedSprite`.

**HTML + canvas side by side.** Use HTML elements alongside or on top of your PixiJS canvas to create rich user interfaces that combine the strengths of both technologies.

**Full PixiJS coverage.** Every PixiJS property, event, and ref is accessible. Break out of the abstraction any time and interact directly with PixiJS objects.

**Testable by design.** Context providers, hooks, and the ticker are structured for simulation in tests. No browser or canvas required for unit tests.

## AI-Assisted Development

This project provides skill-based documentation for AI code assistants, containing the library's API and patterns. When using an LLM to generate pixi-solid code, you can reference:

- [`SKILL.md`](https://github.com/LukeCarlThompson/pixi-solid/blob/main/packages/pixi-solid/src/skill/pixi-solid/SKILL.md) — main entry point for the skill docs
- [Skill API references](https://github.com/LukeCarlThompson/pixi-solid/tree/main/packages/pixi-solid/src/skill/pixi-solid) — detailed docs on components, hooks, lifecycle, testing, and utils
- [`AGENTS.md`](https://github.com/LukeCarlThompson/pixi-solid/blob/main/AGENTS.md) — contribution and architecture guide
- [📖 Docs site](https://lukecarlthompson.github.io/pixi-solid/) — live examples and interactive documentation

## Contributing

Contributions are welcome! Feel free to open an issue to report a bug, suggest a feature, or submit a pull request.

## License

This project is licensed under the MIT License.
