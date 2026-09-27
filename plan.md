# Pixi-Solid v2: Solid 2 Migration

Branch `release/solid-2`, baseline `26d03e1` (tag `v1.0.0`). The library, tests, docs, and release
metadata are migrated and committed. [Remaining work](#remaining-work) follows.

## Goal and policy

- `pixi-solid` v2 supports Solid 2 only. This branch carries no Solid 1 compatibility code.
- The published 1.x line stays available for Solid 1 maintenance, on `release/next`.
- Pin exact versions, and keep Solid external as a peer dependency.

## Stack

| Area            | Version                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| Solid           | `solid-js@2.0.0-rc.9`, `@solidjs/web@2.0.0-rc.9`                                         |
| Compiler / Vite | `@solidjs/vite-plugin@3.0.0-next.35`, Vite 8.3.0, `jsxImportSource: "@solidjs/web"`      |
| Docs site       | Astro 7.3.5, Starlight 0.42.4                                                            |
| Package         | `2.0.0-rc.0`; peers `solid-js`/`@solidjs/web` `>=2.0.0-rc.9 <3`, `pixi.js` `>=8.14.3 <9` |

## Done

- Every component, binder, provider, and utility runs on Solid 2. `splitProps`, `on`, `batch`,
  `createMutable`, `createResource`, `Index`, `ErrorBoundary`, and the `solid-js/store` and
  `solid-js/web` subpaths are gone.
- Breaking changes for users of v1: `ref` callbacks are unowned and run once, `as` now applies
  initialisation props, `Graphics` takes a `draw` prop, and `class` replaces `classList` on
  `PixiCanvas`. The
  [migration guide](packages/pixi-solid-docs/src/content/docs/migration/solid-2.mdx) covers each one.
- Testing utilities are `mountScene(setup, { wrapper })`, `renderHook(cb, { wrapper })`, `cleanup()`,
  and `createTestContext().mount`. `waitFor` was removed, because Solid 2 makes `flush()`
  deterministic. 20 files and 182 tests pass.
- The docs site runs on Solid 2 through `@solidjs/vite-plugin` and the `DemoMount.astro` client-side
  renderer. The README, the consumer skills, the migration guide, and the STE writing rules are
  current.
- The `preinstall` script is gone, and `files` and the exports were verified from a packed tarball.

## Remaining work

In order. Nothing is deferred.

### Stage 1: Verify the branch

1. **Verify from a clean install.** Remove `node_modules`, install with `--frozen-lockfile`, then run
   `pnpm lint`, the library typecheck, tests, and build, the docs typecheck, and the docs build.
   Everything passes incrementally, but never from a cold `node_modules`. Decide what to do about the
   five pre-existing `oxlint` warnings, because CI gates on `pnpm lint`.
2. **Get CI onto this branch.** `ci.yml` triggers on a pull request to `main`, and the `branches`
   filter matches the base. So a pull request from this branch into `main` runs CI, and it needs no
   workflow change. Keep it open until Stage 3, because merging to `main` publishes `latest` today.
   The alternative is a `push: branches: ["release/**"]` trigger.
3. **Push the pending v1 commit.** `release/next` is one commit ahead of origin:
   `525d3c2 fix: migrate v1 benchmarks to the Vitest 5 fixture API`.

### Stage 2: Harden the package

These checks guard the published artifact, so they complete before the RC is published.

4. **Add `publint` and `@arethetypeswrong/cli`** (`attw`) against the packed tarball, in CI. Together
   they cover most packaged-package problems, with far less maintenance than a committed fixture.
5. **Add a pack and install smoke job.** Pack the library, install it into a temporary directory, then
   typecheck and run a small scene. This replaces the removed `fixtures/solid2-consumer` harness and
   commits no nested workspace.
6. **Fix the same problems on the v1 branch.** The `preinstall` script, the missing declarations, and
   the invalid committed benchmark baseline were never specific to this migration. The committed
   `results/baseline.json` was generated under vitest's `node` environment, where Solid 1 resolves to
   the non-reactive server build, so it does not measure reactive updates.
7. **Audit the remaining components.** `AnimatedSprite` has settable instance properties that the
   Pixi options type omits, such as `currentFrame`. Check the other components for the same shape, and
   record the result so that the README coverage claim can be stated accurately.
8. **Mirror the benchmark suite onto the v1 branch.** Most of it is already there.
   `point-property-lookup`, `set-event-property`, and `set-prop-assignment` are identical to this
   branch, and `container-prop-updates` differs only by the `flush()` calls that Solid 1 does not
   export, so the workloads stay comparable. Two things remain. Port `bind-props-strategies`,
   pointing its per-key entry at the v1 binder: v1 already creates one inner render effect per key
   inside `bindRuntimeProps`, so export that helper the way this branch exports `bindPropsByKey`.
   Then regenerate the v1 baselines, which item 6 covers. Mirror every later benchmark change across
   both lines, and record the v1-to-v2 comparison from the same command on both branches.

### Stage 3: Prepare the release lines

Publishing is coupled to `main`, and npm tags every publish as `latest` by default
(`defaultTag: 'latest'`, with no case for a prerelease version). The package sets no
`publishConfig.tag`, and the workflow passes no `--tag`. The registry shows `{ latest: '1.0.0' }`. So
the current path would move `latest` to `2.0.0-rc.0`, and serve it to every `npm install pixi-solid`.

9. **Publish from tags, not from branches.** Trigger the publish workflow on a version tag
   (`push: tags: ["v*"]`) and publish from the tagged ref. That decouples both directions, and
   `check-published-version.mjs` already makes a repeated run safe.

   | Line          | Version      | Tag      | Result                         |
   | ------------- | ------------ | -------- | ------------------------------ |
   | v2 prerelease | `2.0.0-rc.0` | `next`   | `latest` stays on `1.0.0`      |
   | v2 stable     | `2.0.0`      | `latest` | `npm i pixi-solid` installs v2 |
   | v1 patch      | `1.0.1`      | `legacy` | `npm i pixi-solid@legacy`      |

10. **Rename `release/next` to `v1.x`.** `main` is the released `v1.0.0`, and `release/next` will
    describe the wrong line once v2 is next. `v1` and `1.x` cannot be tag names, because npm refuses a
    tag that parses as a semver range. Use `legacy`, `release-1`, or `v1-latest`.
11. **Record the change policy in CONTRIBUTING.** A fix cannot be cherry-picked between the lines,
    because v2 is a port rather than a superset. A security or critical correctness fix gets one
    hand-written implementation per line. Everything else is v2 only, and a v1 patch takes no features.

Documentation stays single-version. The site publishes to gh-pages from `main`, so the v1 pages leave
when v2 lands. npm serves the README of the installed version, which covers v1 users.

### Stage 4: Publish

12. **Finalize the changelog heading.** The v2 entry starts with `## Unreleased`. Decide when it
    becomes `## 2.0.0-rc.0`, then `## 2.0.0`, because the file ships to npm.
13. **Publish `2.0.0-rc.0`** under the `next` dist-tag, then confirm that `latest` still points at
    `1.0.0`.
14. **Address RC feedback.** Publish further RCs as needed, repeat the relevant checks, bump
    `packages/pixi-solid/package.json` to `2.0.0`, and publish stable.
15. **Point the migration guide at Solid's `main` branch docs** once Solid 2 ships stable, then delete
    this file.
