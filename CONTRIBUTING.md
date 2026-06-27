# Contributing to pixi-solid

Thank you for contributing! This document covers the conventions, standards, and patterns used across this monorepo.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Monorepo Structure](#monorepo-structure)
- [Commands](#commands)
- [TypeScript Conventions](#typescript-conventions)
- [Naming Conventions](#naming-conventions)
- [Component Architecture](#component-architecture)
- [Testing](#testing)
- [Styling](#styling)
- [Pull Requests](#pull-requests)
- [Versioning & Changelog](#versioning--changelog)

---

## Getting Started

This repo uses **pnpm**. npm and yarn are not supported.

```bash
pnpm install
pnpm dev       # start all dev servers
pnpm test      # run all tests
pnpm lint      # run oxlint
pnpm fmt       # format with oxfmt
```

---

## Monorepo Structure

```
packages/
  pixi-solid/         # the library package
  pixi-solid-docs/    # public docs site (Astro + Starlight) — for consumers, not contributors
```

- Root `tsconfig.json`, `.oxlintrc.json`, and `.oxfmtrc.json` apply across the monorepo.
- Shared dependency versions are pinned via `pnpm.overrides` in the root `package.json`.
- The `preinstall` script enforces pnpm via `only-allow`.

---

## Commands

### Root

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `pnpm build`     | Build all packages             |
| `pnpm dev`       | Run all dev servers            |
| `pnpm test`      | Run all tests                  |
| `pnpm lint`      | Lint with oxlint               |
| `pnpm fmt`       | Format with oxfmt              |
| `pnpm fmt:check` | Check formatting (no writes)   |

### `packages/pixi-solid`

| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| `pnpm build`               | Vite build + TypeScript declarations  |
| `pnpm test`                | Vitest                                |
| `pnpm test:bench`          | Run benchmarks                        |
| `pnpm test:bench:save`     | Save benchmark results as baseline    |
| `pnpm test:bench:compare`  | Compare benchmarks against baseline   |
| `pnpm build:skill`         | Copy LLM skill files to dist/skill (runs automatically after build) |

---

## TypeScript Conventions

### Strict Mode

All packages use `strict: true` plus additional strictness:

- `noUncheckedSideEffectImports: true`
- `verbatimModuleSyntax: true`
- `isolatedModules: true`

### Type Imports

Always use separate `type` imports (enforced by oxlint):

```ts
// ✅ correct
import type { Container } from "pixi.js";
import { onTick } from "../on-tick";

// ❌ wrong
import { type Container } from "pixi.js";
```

### Type Definitions

Prefer `type` over `interface` (enforced):

```ts
// ✅ correct
type SpriteProps = { x: number; y: number };

// ❌ wrong
interface SpriteProps { x: number; y: number }
```

### Other Enforced Rules

- Use `===` and `!==` (no `==`)
- Prefer `const` over `let`
- No non-null assertions (`!`)
- Mark properties `readonly` where applicable
- No unnecessary `async` functions
- Explicit type exports (`export type { Foo }`)
- No circular imports (warned)

### Import Order

Imports are sorted automatically by oxfmt in this order:
`side-effect` → `builtin` → `external` → `internal` → `parent` → `sibling` → `index`

---

## Naming Conventions

| Category          | Convention            | Example                                  |
| ----------------- | --------------------- | ---------------------------------------- |
| Components        | PascalCase            | `Container`, `Sprite`, `Graphics`        |
| Hooks / utilities | camelCase             | `onTick`, `useSpring`, `useSmoothDamp`   |
| Types             | PascalCase + `Props`  | `SpriteProps`, `ContainerProps`          |
| Constants         | UPPER_SNAKE_CASE      | `SOLID_PROP_KEYS`, `CONTAINER_RUNTIME_KEYS` |
| Source files      | kebab-case            | `bind-props.ts`, `point-property-names.ts` |
| Component files   | kebab-case `.tsx`     | `pixi-application-provider.tsx`          |
| Barrel files      | `index.ts`            | `components/index.ts`                    |

---

## Component Architecture

### Container vs Leaf

- **Container** components accept `children?: JSX.Element` — e.g. `Container`, `ParticleContainer`.
- **Leaf** components do not accept children — e.g. `Sprite`, `Graphics`, `BitmapText`.

### Factory Functions

All components are created via factory functions in `packages/pixi-solid/src/components/component-factories.ts`:

| Factory | Creates | Has children? | Extra props |
|---|---|---|---|
| `createContainerComponent()` | Components that accept children | ✅ Yes | Common point axes |
| `createLeafComponent()` | Components without children | ❌ No | Common point axes |
| `createSpriteComponent()` | Sprite-like components | ❌ No | Common + anchor point axes |
| `createAnimatedSpriteComponent()` | AnimatedSprite with managed autoUpdate | ❌ No | Common + anchor point axes |
| `createTilingSpriteComponent()` | TilingSprite | ❌ No | Common + anchor + tiling axes |
| `createFilterComponent()` | Filter components | ❌ No | None (ref + as only) |

### Adding a New Component

1. **Pick the right factory** from the table above.
2. **Choose prop type** — `ContainerProps`, `LeafProps`, `SpriteProps`, `TilingSpriteProps`, or define a new one.
3. **Call the factory** in `packages/pixi-solid/src/components/components.tsx`:

```tsx
export const MyNewComponent = createContainerComponent<PixiMyNew, Pixi.MyNewOptions>(PixiMyNew);
```

4. **Export** — add to `components/index.ts` and `src/index.ts`.
5. **Add tests** — use `mountTest` from testing utilities, verify ref typing, prop binding, and cleanup (including the `as` prop skip-destroy guard).

### Prop Binding

Located in `packages/pixi-solid/src/components/bind-props/`. Props are bound in two phases:

1. **`bindInitialisationProps()`** — sets static props on mount (e.g. `texture`), passed to the Pixi class constructor.
2. **`bindRuntimeProps()`** — reactive props bound with `createRenderEffect()` via Solid's `on` helper.

Point properties (`position`, `scale`, `pivot`, `anchor`, etc.) accept either a number or an object. They are split into individual axis props using `splitProps` and handled by `setPointProperty`.

Event handlers follow the `on*` naming convention (e.g. `onPointerDown`) and are mapped to PixiJS `instance.on()` calls.

### Lifecycle / Cleanup

```ts
onCleanup(() => {
  instance.destroy({ children: true });
});
```

Use `children: false` only for `RenderLayer` (which does not own its children).

When the `as` prop is provided, the factory skips `destroy()` entirely — the caller owns the instance's lifecycle. The guard checks `runtimeProps.as` (after `splitProps`), not `props.as`, since Solid's `splitProps` consumes the value from the reactive props object.

### Context Providers

| Provider | Provides | File |
|---|---|---|
| `PixiCanvas` | App + canvas DOM element + all hooks | `pixi-canvas.tsx` |
| `PixiApplicationProvider` | App context + all hooks | `pixi-application/pixi-application-provider.tsx` |
| `TickerProvider` | Ticker context only — `getTicker`, `onTick`, ticker-synced delays | `pixi-application/pixi-application-provider.tsx` |

Context objects are in `packages/pixi-solid/src/pixi-application/context.ts`.

---

## Testing

### Setup

- Tests are colocated as `*.test.ts` / `*.test.tsx` alongside their source files.
- Framework: **Vitest** with `jsdom` environment.
- Run with `pnpm test`.

### Structure

Use **GIVEN / WHEN / THEN** inside `describe` / `it` blocks:

```tsx
describe("Container component", () => {
  it("GIVEN a Container WHEN the root is disposed THEN the instance is destroyed", () => {
    let container: Pixi.Container | undefined;

    const { dispose } = mountTest(() => (
      <Container ref={(el) => { container = el; }} />
    ));
    dispose();

    expect(container?.destroyed).toBe(true);
  });
});
```

### Test Utilities

Located in `packages/pixi-solid/src/testing/`:

- `mountTest(setup)` — mount JSX or Solid code in a temporary root. Returns `{ value, dispose }`.
- `createTestContext()` — mock provider returning `{ Provider, ticker, renderer, app }`.
- `createManualTicker()` — stopped ticker with `fastForwardFrames()` and `fastForwardTime()`.
- `getByLabel(root, label)` / `queryByLabel(root, label)` / `getAllByLabel(root, label)` — scene graph queries.

See `packages/pixi-solid/src/testing/README.md` for full usage.

Use `afterEach(() => vi.restoreAllMocks())` to clean up mocks between tests.

---

## Styling

- **No Tailwind**.
- Use **CSS Modules** (`.module.css` or `.module.scss`).
- SCSS is supported via `sass-embedded`; write nested **BEM** style when using SCSS modules.

```scss
// ✅ correct — nested BEM in SCSS module
.controls {
  &__button {
    color: red;

    &--active {
      color: blue;
    }
  }
}
```

---

## Pull Requests

Every PR must include:

1. **A version bump** in `packages/pixi-solid/package.json`.
2. **A changelog entry** in `packages/pixi-solid/CHANGELOG.md`.

Follow semantic versioning: `MAJOR.MINOR.PATCH`.

- Bug fix → patch bump
- New feature (backward-compatible) → minor bump
- Breaking change → major bump

---

## Versioning & Changelog

The changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with emoji markers:

| Emoji | Type        | When to use                              |
| ----- | ----------- | ---------------------------------------- |
| ✅    | Added       | New feature or component                 |
| ⚙️    | Changed     | Changes to existing functionality        |
| 😵    | Deprecated  | Feature marked for future removal        |
| 💀    | Removed     | Feature removed                          |
| 🐞    | Fixed       | Bug fix                                  |

**Example entry:**

```markdown
## 0.2.0
- ✅ Added `MeshRope` component.
- 🐞 Fixed anchor prop not updating reactively on `Sprite`.
```

New entries go at the top of the file, above previous versions.
