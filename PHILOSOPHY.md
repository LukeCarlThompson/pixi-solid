# Philosophy

pixi-solid is a declarative wrapper around PixiJS built on SolidJS's reactive primitives. It works alongside the standard SolidJS DOM renderer — canvas and HTML content coexist in the same application without conflict. You compose interactive 2D scenes using components and signals, the same mental model you'd use for any SolidJS application.

The library is organised into two layers:

- **Core** — components and hooks that bridge PixiJS to SolidJS reactivity. This is the stable foundation: lifecycle management, reactive prop binding, scene graph composition, and context providers.
- **Extended utilities** — optional helpers that build on the core but aren't essential to it. Animation, layout, and timing conveniences live here. They may grow, change, or move to a separate package over time without affecting the core's stability.

The following principles guide every design decision in the library.

## Quick setup without ceremony

Getting a basic scene on screen should take a few lines of code and zero boilerplate. The library provides sensible defaults for common PixiJS setup — application creation, canvas mounting, ticker configuration — so you can start fast. As your scene's needs grow, you opt into customization only where you need it.

## PixiJS without compromise

PixiJS is a mature, capable library. pixi-solid should never stand in its way. Every PixiJS class, property, and method remains reachable. If the library doesn't expose a feature declaratively, you can always reach for the imperative API directly — no special ceremony or workarounds required.

## Wrappers with purpose

Wrapping a PixiJS API is only worthwhile when SolidJS reactivity provides a clear benefit: lifecycle management, automatic cleanup, reactive property binding, or composable scene graphs. If a direct PixiJS call is simpler and no less ergonomic, use it directly. The library errs on the side of not adding a wrapper.

## Imperative interop when it counts

Declarative components are the default and encouraged path. Imperative PixiJS interop is fully supported and will never break — but it's reserved for cases where it genuinely adds value: performance-critical hot paths, integrating third-party PixiJS plugins, or accessing advanced APIs that aren't yet wrapped. In day-to-day use, reach for components first.

## Respects PixiJS construction semantics

PixiJS objects have their own construction contracts — some properties must be set at creation time and can't be changed later without side effects. The library respects this distinction. Components handle construction and runtime updates differently to match how PixiJS expects to be used, rather than overriding it.

## One reactive model

SolidJS signals, stores, and resources are shared across your entire application, not confined to the canvas. Canvas content and HTML UI react to the same state. There's no separate bridging layer, messaging system, or two-way sync — the reactive primitives you already know work the same way everywhere.

## Unified timing model

Animations, frame callbacks, delays, and sprite updates all synchronise to the ticker provided by context. Whether you use `onTick`, `useSpring`, `delay`, or an `AnimatedSprite`, everything runs on the same clock source — the one in scope. This avoids timing drift and keeps the whole scene coherent.

## Cleanup you can rely on

When a component unmounts, it cleans up after itself — display objects, listeners, textures, ticker subscriptions. You shouldn't have to manually track disposal or risk memory leaks. This automatic lifecycle management is one of the primary benefits of the declarative approach.

## Verifiability by design

Components and scenes should be testable without a browser or canvas. Context providers, lifecycle hooks, and the ticker are all structured so they can be replaced or simulated in tests. This keeps the library trustworthy as scenes grow in complexity.

## Types you can trust

Every component, hook, function, and export is fully typed. The type system should guide you toward correct usage and catch mistakes at compile time. No `as any` escapes should be necessary for supported APIs.
