# Pixi-Solid

A custom renderer for [PixiJS](https://pixijs.com/) that lets you build your scene with [SolidJS](https://www.solidjs.com/) JSX components and its fine-grained signals based reactivity.

[![NPM Version](https://img.shields.io/npm/v/pixi-solid.svg)](https://www.npmjs.com/package/pixi-solid)
[![License](https://img.shields.io/npm/l/pixi-solid.svg)](https://github.com/your-username/pixi-solid/blob/main/LICENSE)

- 💙 Lightweight and flexible SolidJS library for creating PixiJS applications.
- 🎁 Provides a set of custom SolidJS components that create PixiJS objects instead of HTML elements.
- 📦 Supports all PixiJS objects, such as Filter, Container, Sprite, Graphics, Text, etc.
- 🧑‍💻 The convenience and speed of SolidJS stores and signals to manage state.
- ✨ All events emitted by PixiJS objects are supported.
- 😎 No limitations. Break out of SolidJS any time and interact directly with PixiJS.
- 💫 Useful helper utilities included.
- 🤩 Full Typescript support for type safety and auto completion.

---

### Install

```bash
npm i pixi-solid pixi.js solid-js
```

Peer dependencies of

```json
{
  "pixi.js": "^8.14.3",
  "solid-js": "^1.9.10"
}
```

---

### Why combine SolidJS with PixiJS?

- **Declarative PixiJS scene graph**: Using SolidJS's JSX templating means we get declarative control over the scene graph. No longer necessary to imperatively add and remove children.

- **Lifecycle hooks in our PixiJS components**: SolidJS rendering PixiJS components means we can take advantage of the built in lifecycle methods in SolidJS `onMount` and `onCleanup` as well as few extra custom hooks so we can automatically subscribe and unsubscribe from the ticker.

- **Shared State and Reactivity**: Pixi Solid leverages SolidJS's reactivity system to automatically update PixiJS components when SolidJS signals or stores change. So your HTML and PixiJS graphics can stay in sync effortlessly.

- **Combine the best of both worlds**: Pixi Solid makes it easy to use HTML elements alongside a PixiJS canvas, allowing you to create rich user interfaces that combine the strengths of both technologies.

- **Composability**: Pixi Solid components can be easily composed together to create complex scenes and animations out of reusable components.

- **SolidJS is a thin wrapper**: While Pixi Solid provides a nice abstraction over PixiJS it provides access to all the properties and events of PixiJS objects.

- **SolidJS is really fast**: SolidJs is on of the fatsest front-end frameworks out there so the overhead is very minimal.

- **SolidJS is fully featured**: It has stores, signals, suspense, error boundaries, resource fetching and more. It's a great feature set for simple or complex applications and you won't have to reach for other libraries to manage templating or state.

---

### Basic Usage

Here's a simple example to get you started. This will render a "Hello World" text on the screen that follows your mouse.

```jsx
import { render } from "solid-js/web";
import { PixiApplication, PixiStage, getPixiApp } from "pixi-solid";
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

### `getPixiApp()`

A hook to get access to the PixiJS `Application` instance.

### `getTicker()`

A hook to get access to the Pixi ticker instance.

### `onTick()`

A hook to auto subscribe and unsubscribe to the ticker in sync with the components lifecycle.
Any function passed in here will be called every frame whilst the component is mounted.

## Contributing

Contributions are welcome! This project is still in its early stages, so feel free to open an issue to report a bug, suggest a feature, or submit a pull request.

## License

This project is licensed under the MIT License.
