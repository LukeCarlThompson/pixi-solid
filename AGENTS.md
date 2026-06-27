# Pixi-Solid Agent Library Contributions Guide

## Repository Structure

This is a **pnpm monorepo**:

- packages/pixi-solid (library)
- packages/pixi-solid-docs (docs site)
- Root config: package.json, pnpm-workspace.yaml, tsconfig.json, .oxlintrc.json, .oxfrmtrc.json

For detailed contribution workflow (commands, TypeScript conventions, naming, testing, styling, PRs, changelog), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Consumer skill

For consumer API docs (components, hooks, utils, testing patterns), see [packages/pixi-solid/src/skill/pixi-solid/](packages/pixi-solid/src/skill/pixi-solid/).

## Architecture

### Component system

Six factory patterns in `packages/pixi-solid/src/components/component-factories.ts`:

| Factory | Creates | Has children? | Extra props |
|---|---|---|---|
| `createContainerComponent()` | Components that accept children | ✅ Yes | Common point axes |
| `createLeafComponent()` | Components without children | ❌ No | Common point axes |
| `createSpriteComponent()` | Sprite-like components | ❌ No | Common + anchor point axes |
| `createAnimatedSpriteComponent()` | AnimatedSprite with managed autoUpdate | ❌ No | Common + anchor point axes |
| `createTilingSpriteComponent()` | TilingSprite | ❌ No | Common + anchor + tiling axes |
| `createFilterComponent()` | Filter components | ❌ No | None (ref + as only) |

All factories support the `as` prop — if provided, the instance is NOT destroyed on cleanup (caller owns lifecycle). The guard uses `runtimeProps.as` (after `splitProps`), not `props.as`, since Solid's `splitProps` consumes the value from the reactive props object.

### Adding a new component

1. **Pick the right factory** from the table above.
2. **Choose prop type** — `ContainerProps`, `LeafProps`, `SpriteProps`, `TilingSpriteProps`, or define a new one.
3. **Call the factory** in [components.tsx](packages/pixi-solid/src/components/components.tsx):

```tsx
export const MyNewComponent = createContainerComponent<PixiMyNew, Pixi.MyNewOptions>(PixiMyNew);
```

4. **Export** — add to `components/index.ts` and `src/index.ts`.
5. **Add tests** — use `mountTest` from testing utilities, verify ref typing, prop binding, and cleanup (including the `as` prop skip-destroy guard).

### Context providers

| Provider | Provides | File |
|---|---|---|
| `PixiCanvas` | App + canvas DOM element + all hooks | `pixi-canvas.tsx` |
| `PixiApplicationProvider` | App context + all hooks | `pixi-application/pixi-application-provider.tsx` |
| `TickerProvider` | Ticker context only — `getTicker`, `onTick`, ticker-synced delays | `pixi-application/pixi-application-provider.tsx` |

Context objects in `packages/pixi-solid/src/pixi-application/context.ts`.

### Property binding

Located in `packages/pixi-solid/src/components/bind-props/`:

- `bindInitialisationProps()` — sets static props on mount (e.g. `texture`)
- `bindRuntimeProps()` — handles reactive prop updates via Solid `on` + `createRenderEffect`
- Point props (`position`, `scale`, etc.) — split into individual axis props using `splitProps`
- Event handlers — `on` + event name format mapped to PixiJS `on()` calls

### Testing utilities

Located in `packages/pixi-solid/src/testing/`. See [README.md](packages/pixi-solid/src/testing/README.md) and [SPEC.md](packages/pixi-solid/src/testing/SPEC.md). Internal — not published.

## Resources

- **Docs Site**: https://lukecarlthompson.github.io/pixi-solid/
- **PixiJS Docs**: https://pixijs.com/
- **SolidJS Docs**: https://www.solidjs.com/
- **npm Package**: https://www.npmjs.com/package/pixi-solid
