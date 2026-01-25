# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- ✅ Added for new features.
- ⚙️ Changed for changes in existing functionality.
- 😵 Deprecated for soon-to-be removed features.
- 💀 Removed for now removed features.
- 🐞 Fixed for any bug fixes.

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
