# Pixi-Solid Agent Library Contributions Guide

## Repository Structure

This is a **pnpm monorepo**:

- packages/pixi-solid (library)
- packages/pixi-solid-docs (docs site)
- Root config: package.json, pnpm-workspace.yaml, tsconfig.json, .oxlintrc.json, .oxfrmtrc.json

For detailed contribution workflow (commands, TypeScript conventions, naming, testing, styling, PRs, changelog), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Consumer skill

For consumer API docs (components, hooks, assets, utils, testing patterns), see [packages/pixi-solid/src/skills/pixi-solid/](packages/pixi-solid/src/skills/pixi-solid/).

## Architecture

See [CONTRIBUTING.md](./CONTRIBUTING.md#component-architecture) for the full architecture reference — it covers:

- **Component factories** — the six factory patterns, what each creates, and which accept children
- **Adding a new component** — step-by-step guide
- **Prop binding** — initialisation vs runtime props, point props, event handlers
- **Lifecycle / cleanup** — destroy semantics and the `as` prop skip-destroy guard
- **Context providers** — `PixiCanvas`, `PixiApplicationProvider`, `TickerProvider`
- **Testing utilities** — `mountScene`, `renderHook`, `createTestContext`, `createManualTicker`, scene graph queries

## Writing style

Prose in JSDoc comments, docs pages, the consumer skill files, the README, the changelog, and migration notes uses ASD-STE100 Simplified Technical English in the STE-flavored mode. Code, identifiers, API names, type signatures, and tables are exempt.

See [CONTRIBUTING.md](./CONTRIBUTING.md#writing-style) for the rules.

## Resources

- **Philosophy**: [PHILOSOPHY.md](PHILOSOPHY.md) — high-level design principles and library values
- **Docs Site**: https://lukecarlthompson.github.io/pixi-solid/
- **PixiJS Docs**: https://pixijs.com/
- **SolidJS Docs**: https://www.solidjs.com/
- **npm Package**: https://www.npmjs.com/package/pixi-solid
