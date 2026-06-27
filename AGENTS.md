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

See [CONTRIBUTING.md](./CONTRIBUTING.md#component-architecture) for the full architecture reference — it covers:

- **Component factories** — the six factory patterns, what each creates, and which accept children
- **Adding a new component** — step-by-step guide
- **Prop binding** — initialisation vs runtime props, point props, event handlers
- **Lifecycle / cleanup** — destroy semantics and the `as` prop skip-destroy guard
- **Context providers** — `PixiCanvas`, `PixiApplicationProvider`, `TickerProvider`
- **Testing utilities** — `mountTest`, `createTestContext`, `createManualTicker`, scene graph queries

## Resources

- **Docs Site**: https://lukecarlthompson.github.io/pixi-solid/
- **PixiJS Docs**: https://pixijs.com/
- **SolidJS Docs**: https://www.solidjs.com/
- **npm Package**: https://www.npmjs.com/package/pixi-solid
