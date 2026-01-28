# Pixi-Solid

A custom renderer for [PixiJS](https://pixijs.com/) that lets you build your scene with [SolidJS](https://www.solidjs.com/) JSX components and its fine-grained signals based reactivity.

[![NPM Version](https://img.shields.io/npm/v/pixi-solid.svg)](https://www.npmjs.com/package/pixi-solid)
[![License](https://img.shields.io/npm/l/pixi-solid.svg)](https://github.com/your-username/pixi-solid/blob/main/LICENSE)

- 💙 Lightweight and flexible SolidJS library for creating PixiJS applications.
- 🎁 Provides a set of custom SolidJS components that create PixiJS objects instead of HTML elements.
- 💪 Supports all PixiJS features.
- 🥳 The convenience and speed of SolidJS stores and signals to manage state.
- ✨ All events emitted by PixiJS objects are supported.
- 😎 No limitations. Break out of SolidJS any time and interact directly with PixiJS.
- 💫 Useful helper utilities included.
- 🤩 Full Typescript support for type safety and auto completion.

Take a look at the [docs site 🧑‍💻](https://lukecarlthompson.github.io/pixi-solid/) for more information.

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

- **SolidJS is really fast**: SolidJs is on of the fastest front-end frameworks out there so the overhead is very minimal.

- **SolidJS is fully featured**: It has stores, signals, suspense, error boundaries, resource fetching and more. It's a great feature set for simple or complex applications and you won't have to reach for other libraries to manage templating or state.

---

## Contributing

Contributions are welcome! This project is still in its early stages, so feel free to open an issue to report a bug, suggest a feature, or submit a pull request.

## License

This project is licensed under the MIT License.
