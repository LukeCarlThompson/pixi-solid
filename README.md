<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Source: packages/pixi-solid/README.md -->

<div align="center">
  <img src="packages/pixi-solid/pixi-solid-logo.png" alt="Pixi-Solid Logo" width="200" />

[![NPM Version](https://img.shields.io/npm/v/pixi-solid.svg)](https://www.npmjs.com/package/pixi-solid)
[![License](https://img.shields.io/npm/l/pixi-solid.svg)](https://github.com/LukeCarlThompson/pixi-solid/blob/main/packages/pixi-solid/LICENSE)
[![CI](https://github.com/LukeCarlThompson/pixi-solid/actions/workflows/ci.yml/badge.svg)](https://github.com/LukeCarlThompson/pixi-solid/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)

</div>

# Pixi-Solid

A custom renderer for [PixiJS](https://pixijs.com/) that lets you build your scene with [SolidJS](https://www.solidjs.com/) JSX components and its fine-grained signals based reactivity.

- 💙 Lightweight and flexible SolidJS library for creating PixiJS applications.
- 🎁 Provides a set of custom SolidJS components that create PixiJS objects instead of HTML elements.
- 💪 Supports all PixiJS features.
- 🥳 The convenience and speed of SolidJS stores and signals to manage state.
- ✨ All events emitted by PixiJS objects are supported.
- 😎 No limitations. Break out of SolidJS any time and interact directly with PixiJS.
- 💫 Useful helper utilities for animations, layout, and async timing.
- 🤩 Full TypeScript support with strict type safety and auto completion throughout the API.

## Install

```bash
npm i pixi-solid pixi.js solid-js
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
    <PixiCanvas style={{ width: "100%", height: "100vh" }}>
      <Sprite
        texture={Texture.WHITE}
        scale={scale()}
        onpointertap={handleSpriteTap}
        tint="#ff0000"
      />
    </PixiCanvas>
  );
};
```

## Next Steps

- **New to Pixi Solid?** Check out the [Getting Started guide](https://lukecarlthompson.github.io/pixi-solid/docs/getting-started/project-setup/) to set up your first project.
- **Explore features** like responsive layout with [`ObjectFitContainer`](https://lukecarlthompson.github.io/pixi-solid/docs/utils/object-fit-container/), animations with [`useSpring`](https://lukecarlthompson.github.io/pixi-solid/docs/utils/use-spring/) and ticker-synced delays.
- **Browse live examples** in the [documentation site](https://lukecarlthompson.github.io/pixi-solid/).

## Why combine SolidJS with PixiJS?

- **Declarative PixiJS scene graph**: Using SolidJS's JSX templating means we get declarative control over the scene graph. For improved separation of concerns, simpler views and more scalable projects.

- **SolidJS hooks in our PixiJS components**: SolidJS rendering PixiJS components means we can take advantage of the built in lifecycle methods in SolidJS `onMount`, `onCleanup` as well as extra custom hooks for responsive behaviour and ticker subscriptions.

- **Shared State and Reactivity**: HTML and PixiJS graphics can stay in sync effortlessly because they can subscribe to the same state.

- **Combine the best of both worlds**: Pixi Solid makes it easy to use HTML elements alongside or on top of a PixiJS canvas, allowing you to create rich user interfaces that combine the strengths of both technologies.

- **Composability**: Pixi Solid components can be easily composed together to create complex scenes and animations out of reusable components.

- **SolidJS is a thin wrapper**: While Pixi Solid provides a nice abstraction over PixiJS it provides access to all the properties and events of PixiJS objects.

- **SolidJS is really fast**: SolidJS is one of the fastest front-end frameworks out there so the overhead is very minimal.

- **SolidJS is fully featured**: It has stores, signals, suspense, error boundaries, resource fetching and more. It's a great feature set for simple or complex applications and you won't have to reach for other libraries to manage templating or state.

## Quick Links

- 📖 **[Full Documentation](https://lukecarlthompson.github.io/pixi-solid/)** — Components, hooks, utilities, and examples
- 🐛 **[GitHub Issues](https://github.com/LukeCarlThompson/pixi-solid/issues)** — Report bugs or request features

## Contributing

Contributions are welcome! Feel free to open an issue to report a bug, suggest a feature, or submit a pull request.

## License

This project is licensed under the MIT License.
