# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 😵 Deprecated for soon-to-be removed features.
- 💀 Removed for now removed features.
- 🐞 Fixed for any bug fixes.

## 0.1.19

- ⚙️ Use more specific peer dependency range
- Improved test helpers and refactored tests
- Use dependency overrides for the mono repo instead of having per package versions

## 0.1.18

- ✅ Added `PixiSolidEventHandlerName` union type to exports.
- 💀 Removed `PixiEventHandlerMap` type from exports.
- 💀 Removed `PIXI_EVENT_NAMES` and `PIXI_SOLID_EVENT_HANDLER_NAMES` constants from exports.
- Renamed internal event types.

## 0.1.17

- 🐞 Fixed a race condition which could cause inconsistent screen dimensions when the `onResize` hook and the `usePixiScreen` hook are used together.

## 0.1.16

- ⚙️ Changed the `AnimatedSprite` component to use the nearest ticker context instead of the Pixi `Ticker.shared` for the `autoUpdate` functionality.

## 0.1.15

- 🐞 Fixed the types for leaf components by removing the `TilingSprite` specific props `tilePosition` and `tileScale` from the prop types.

## 0.1.14

- ✅ Adds an optional ticker priority argument to the `onTick` hook.

## 0.1.13

- 🐞 Fix usePixiScreen hook not being reactive on all values.

## 0.1.12

- 🐞 Fixed component destroy behaviour to be managed by the components own lifecycle rather than in the bind children function.
  Fixes a bug where children would not be destroyed if a `PixiCanvas` was unmounted.

## 0.1.11

- 🐞 `PixiApplicationProvider` now only destroys the app instance on unmount if it created it.

## 0.1.10

- 🐞 Fixed event handler reactivity where handlers bound through spread props were not properly unregistered when updated.
- 🐞 Fixed component prop reactivity if a signal is spread into a component with dynamic properties.

## 0.1.9

- 🐞 Fixed components that have initial arguments that aren't exposed as public properties on the instance.

## 0.1.8

- Refactored prop binding to improve performance and added benchmark tests.

## 0.1.7

- 🐞 Fix timing of ref assignment to be consistent with SolidJS.
  Ref's are meant to be assigned before the element is added to the scene and `onMount` should be used to reference elements after they are added to the scene.
  Reverts the change in `0.1.4`.

## 0.1.5

- 🐞 Fix context loss in ref callback function scope.

## 0.1.4

- 🐞 Fix timing of ref callback to make sure the object is added to the scene before the ref is set.

## 0.1.3

- ✅ Improved error handling for invalid children.

## 0.1.2

- Cleanup

## 0.1.1

- Internal refactor to remove the universal renderer

## 0.1.0

#### ✅ Added

- Added `PixiApplicationProvider` component that can be ued to instantiate the Pixi Application allowing the hooks and utilites to work within it's scope.
- Added option to abort an async delay early by passing in an abort signal.

#### ⚙️ Changed

- Changed the `PixiCanvas` component to not require a `PixiApplication` as a wrapper.
  It uses the context from the `PixiApplicationProvider` if available or it will instantiate it's own Pixi Application if an existing one isn't found.

#### 💀 Removed

- Removed the `PixiApplication` component as it's purpose can be solved in a more flexible way.

#### 🐞 Fixed

- Fixed the `RenderLayer` children from not being removed properly.

## 0.0.36

#### 💀 Removed

- Removed the `PixiStage` component as it provided little value and was a bit of a nuisance.
  The pixi stage component can be accessed from the `getPixiApp` context if required.

#### ✅ Added

- Added a utility type `PixiComponentProps` that is useful for extending custom component props that users want to pass through.

## 0.0.33

#### ⚙️ Changed

- Added defaults for the `PixiApplication` back in. Set `autoDensity` to `true` and `resolution` to use `window.devicePixelRatio` by default.

## 0.0.32

#### ✅ Added

- Added default styles to the `canvas` element to stop select on long press on touch sreens.

## 0.0.31

#### ✅ Added

- Added support for granular control of PixiJS point properties directly as JSX props (e.g., `positionX`, `scaleY`, `pivotX`).

#### ⚙️ Changed

- Changed `PixiApplication` component to allow all standard `ApplicationOptions` to be passed directly as props during initialization and removed opinionated defaults.

## 0.0.31

#### ✅ Added

- Added a `useSmoothDamp` hook for smoothly dampening a numeric value towards a target over time, synchronized with the PixiJS ticker.
- Added a `useSpring` hook for creating spring-based animations for numeric values, synchronized with the PixiJS ticker.

## 0.0.30

#### ✅ Added

- Added a `usePixiScreen` hook that returns the Pixi Screen dimensions as a reactive store that can be subscribed to.
