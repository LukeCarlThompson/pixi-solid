# Extracting `pixi-solid/testing` to a separate package

## Motivation

A separate `pixi-solid-testing` package would:
- Remove the `pixi.js` and `solid-js` dependency weight from consumer projects that don't use the testing utilities
- Allow independent versioning of testing APIs
- Enable the testing utilities to have their own test runner config (e.g. if they need `happy-dom` or `jsdom` setup)

## Dependency Analysis

| Testing file | Imports from pixi-solid internals | Extractable? |
|---|---|---|
| `test-root.tsx` | No — only Solid's `createRoot` | ✅ Yes, as-is |
| `manual-ticker.ts` | No — only PixiJS `Ticker` | ✅ Yes, as-is |
| `query-by-label.ts` | No — only PixiJS `Container` type | ✅ Yes, as-is |
| `test-context.tsx` | Yes — contexts + screen store creator | ❌ Blocked |

## Peer Dependencies

| Dependency | Used by |
|---|---|
| `pixi.js` (>=8.x) | `manual-ticker.ts`, `query-by-label.ts`, `test-context.tsx` |
| `solid-js` (>=1.9.x) | `test-root.tsx`, `test-context.tsx` |
| `pixi-solid` | `test-context.tsx` — for context objects |

Consumers will already have `pixi.js` and `solid-js` if they use `pixi-solid`. The testing library adds `pixi-solid` as an additional peer dependency.

## Internal API Blocker

`createTestContext` needs these non-public exports from `pixi-solid`:

```ts
import { PixiAppContext, ScreenStoreContext, TickerContext } from "pixi-solid";
import { createPixiScreenStore } from "pixi-solid";
```

These are currently internal. To unblock:
- Export `PixiAppContext`, `TickerContext`, `ScreenStoreContext` from `pixi-application/index.ts`
- Export `createPixiScreenStore` from `use-pixi-screen/index.ts`

These are stable, low-risk additions — just context objects and a factory function.

## Build & Config

The package would use the same monorepo tooling as `pixi-solid`:

- **pnpm workspace** — add to root `pnpm-workspace.yaml`
- **vite** — simple lib build (`formats: ["es"]`), no external renderer config
- **No JSX custom renderer** — the testing package mounts into Solid roots, it doesn't render PixiJS
- **No export maps needed** — single entry point `"."`

## Proposed package structure

```
packages/pixi-solid-testing/
├── package.json
│   name: "pixi-solid-testing"
│   peerDependencies: { pixi.js, solid-js, pixi-solid }
├── tsconfig.json
│   extends: root tsconfig
├── vite.config.ts
│   lib entry: src/index.ts
├── src/
│   ├── index.ts              ← barrel (same as current)
│   ├── test-root.ts          ← mountTest (no change)
│   ├── manual-ticker.ts      ← createManualTicker (no change)
│   ├── query-by-label.ts     ← getByLabel et al. (no change)
│   └── test-context.tsx      ← createTestContext (imports from pixi-solid)
├── README.md
└── SPEC.md
```

## Migration Steps

### Phase 1 — Prepare (in pixi-solid)

1. Export the four internals needed by `test-context.tsx` from pixi-solid's public barrel
2. This is the only upstream change required

### Phase 2 — Extract (new package)

1. `mkdir packages/pixi-solid-testing`
2. `pnpm init`, copy source files, add peer deps
3. Set up `vite.config.ts` and `tsconfig.json`
4. Add to root `pnpm-workspace.yaml`
5. Verify with `pnpm build` in the new package

### Phase 3 — Migrate (pixi-solid tests)

1. Add `pixi-solid-testing` as a devDependency of `pixi-solid`
2. Update all `import { ... } from "../testing"` to `import { ... } from "pixi-solid-testing"`
3. Remove `src/testing/` from pixi-solid
4. Run full test suite — should be identical

### Phase 4 — Publish

1. Publish `pixi-solid-testing` alongside `pixi-solid` (same release cycle initially)
2. Consider independent versioning once the API stabilises

## Versioning Strategy

Testing utilities are tightly coupled to `pixi-solid` internals. Suggested approach:
- **Initial releases:** publish matching versions (e.g. `pixi-solid-testing@1.0.0-rc.7` alongside `pixi-solid@1.0.0-rc.7`)
- **Future:** version independently once the API surface is stable. Major bumps should still align.

## Non-goals

- **No vitest coupling.** Utilities remain framework-agnostic. Users wire up cleanup themselves.
- **No re-export of pixi-solid components.** Consumers import components from `pixi-solid`.
- **No JSX renderer.** The testing package doesn't render PixiJS; it mounts into Solid roots.
