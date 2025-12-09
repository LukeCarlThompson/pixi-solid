# Pixi-Solid

A custom renderer for [PixiJS](https://pixijs.com/) that lets you build your scene with [SolidJS](https://www.solidjs.com/) JSX components and its fine-grained signals based reactivity.

[![NPM Version](https://img.shields.io/npm/v/pixi-solid.svg)](https://www.npmjs.com/package/pixi-solid)
[![License](https://img.shields.io/npm/l/pixi-solid.svg)](https://github.com/your-username/pixi-solid/blob/main/LICENSE)

## Why Pixi-Solid?

`pixi-solid` combines the power of two amazing libraries:

- **PixiJS:** A fast, lightweight, and powerful 2D rendering library.
- **SolidJS:** A declarative, performant, and reactive JavaScript library for building user interfaces.

By using `pixi-solid`, you can write your PixiJS applications declaratively using JSX, manage state with Solid's powerful reactivity system, and structure your scene as a tree of reusable components. This leads to more maintainable and readable code for complex graphical applications.

It is intended to provide nice abstractions for encapsulating useful functionality and state management to represent the core logic of your application.

In some cases when creating high performance applications like games which may have lots of fast changing state and logic every frame it may be beneficial to escape from SolidJS and use Pixi imperatively.
In these cases you may want to create an imperative component and update it every frame with the `useTick` method and then wrap it inside a `<Container />` component as an easy way of packaging it.

## Getting Started

### Installation

To install `pixi-solid` along with its peer dependencies, run:

```bash
npm install pixi-solid pixi.js solid-js
# or
yarn add pixi-solid pixi.js solid-js
# or
pnpm add pixi-solid pixi.js solid-js
```

You will also need to configure your build tool to handle Solid's JSX. For Vite, you can use `vite-plugin-solid`.

### Basic Usage

Here's a simple example to get you started. This will render a "Hello World" text on the screen that follows your mouse.

```jsx
import { render } from "solid-js/web";
import { PixiApplication, PixiStage, usePixiApp } from "pixi-solid";
import { Text, FederatedPointerEvent } from "pixi.js";
import { createSignal, onMount } from "solid-js";

const FollowText = () => {
  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  const handlePointerMove = (e: FederatedPointerEvent) => {
    setPosition({ x: e.global.x, y: e.global.y });
  };

  return (
    <Text
      text="Hello World"
      onglobalpointermove={handlePointerMove}
      anchor={{ x: 0.5, y: 0.5 }}
      x={position().x}
      y={position().y}
      style={{ fill: "white", fontSize: 24 }}
    />
  );
};

const App = () => (
  <div style={{ width: "100vw", height: "100vh", display: "flex", "flex-direction": "column" }}>
    <PixiApplication background={"#1099bb"}>
      <PixiCanvas>
        <PixiStage eventMode={"static"}>
          <FollowText />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  </div>
);

render(() => <App />, document.getElementById("root"));
```

## Core Components & Hooks

### `<PixiApplication>`

This component creates the main PixiJS `Application` instance and provides it to all child components via context. Any options passed to it are forwarded to the `Application` constructor.

### `<PixiCanvas>`

This component creates a `div` and mounts the PixiJS canvas into it. It automatically handles resizing the canvas to fit the container. Your scene components should be placed as children of `<PixiCanvas>`.

### `<PixiStage>`

This component gives us a reference to the Pixi stage which is the top level container of your scene. It is useful for listening to global events.

### `usePixiApp()`

A hook to get access to the PixiJS `Application` instance.

### `useTicker()`

A hook to get access to the Pixi ticker instance.

### `useTick()`

A hook to auto subscribe and unsubscribe to the ticker in sync with the components lifecycle.
Any function passed in here will be called every frame whilst the component is mounted.

## Contributing

Contributions are welcome! This project is still in its early stages, so feel free to open an issue to report a bug, suggest a feature, or submit a pull request.

## License

This project is licensed under the MIT License.
