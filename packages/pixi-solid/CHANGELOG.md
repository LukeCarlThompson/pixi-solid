# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 😵 Deprecated for soon-to-be removed features.
- 💀 Removed for now removed features.
- 🐞 Fixed for any bug fixes.

## 0.1.0

#### Added

- ✅ Added `PixiApplicationProvider` component that can be ued to instantiate the Pixi Application allowing the hooks and utilites to work within it's scope.
- ✅ Added option to abort an async delay early by passing in an abort signal.

#### Changed

- ⚙️ Changed the `PixiCanvas` component to not require a `PixiApplication` as a wrapper.
  It uses the context from the `PixiApplicationProvider` if available or it will instantiate it's own Pixi Application if an existing one isn't found.

#### Removed

- 💀 Removed the `PixiApplication` component as it's purpose can be solved in a more flexible way.

#### Fixed

- 🐞 Fixed the `RenderLayer` children from not being removed properly.

## 0.0.36

#### Removed

- 💀 Removed the `PixiStage` component as it provided little value and was a bit of a nuisance.
  The pixi stage component can be accessed from the `getPixiApp` context if required.

#### Added

- ✅ Added a utility type `PixiComponentProps` that is useful for extending custom component props that users want to pass through.

## 0.0.33

#### Changed

- ⚙️ Added defaults for the `PixiApplication` back in. Set `autoDensity` to `true` and `resolution` to use `window.devicePixelRatio` by default.

## 0.0.32

#### Added

- ✅ Added default styles to the `canvas` element to stop select on long press on touch sreens.

## 0.0.31

#### Added

- ✅ Added support for granular control of PixiJS point properties directly as JSX props (e.g., `positionX`, `scaleY`, `pivotX`).

#### Changed

- ⚙️ Changed `PixiApplication` component to allow all standard `ApplicationOptions` to be passed directly as props during initialization and removed opinionated defaults.

## 0.0.31

#### Added

- ✅ Added a `useSmoothDamp` hook for smoothly dampening a numeric value towards a target over time, synchronized with the PixiJS ticker.
- ✅ Added a `useSpring` hook for creating spring-based animations for numeric values, synchronized with the PixiJS ticker.

## 0.0.30

#### Added

- ✅ Added a `usePixiScreen` hook that returns the Pixi Screen dimensions as a reactive store that can be subscribed to.
