# Pixi-Solid v2: Solid 2 Migration

Branch `release/v2`, baseline `26d03e1` (tag `v1.0.0`). SolidJS 2 is stable, `2.0.0-rc.1` is on npm,
and `main` has moved on. The work below carries v2 to a stable release and keeps the v1 line alive.

## Goal and policy

- `pixi-solid` v2 supports Solid 2 only. This branch carries no Solid 1 compatibility code.
- The published 1.x line stays available for Solid 1 users, on `release/v1`.
- Pin exact versions, and keep Solid external as a peer dependency.
- `pixi-solid-3d` is not released at 1.0. It stays on Solid 1 and moves to Solid 2 after v2 ships.

## Stack

| Area            | Target                                                                   | Current on this branch |
| --------------- | ------------------------------------------------------------------------ | ---------------------- |
| Solid           | `solid-js@2.0.3`, `@solidjs/web@2.0.3`                                   | `2.0.0-rc.13`          |
| Compiler / Vite | `@solidjs/vite-plugin@3.0.1`, Vite 8.3.0, `jsxImportSource: "@solidjs/web"` | `3.0.0-next.35`        |
| Docs site       | Astro 7.3.5, Starlight 0.42.4                                            | same                   |
| Package         | `2.0.0`; peers `>=2.0.0 <3`                                              | `2.0.0-rc.1`, peers `>=2.0.0-rc.13 <3` |

## Done

- Every component, binder, provider, and utility runs on Solid 2. 20 test files and 182 tests pass.
- Breaking changes for v1 users: `ref` callbacks are unowned and run once, `as` applies
  initialisation props, `Graphics` takes a `draw` prop, and `class` replaces `classList` on
  `PixiCanvas`. The [migration guide](packages/pixi-solid-docs/src/content/docs/migration/solid-2.mdx)
  covers each one.
- Test utilities are `mountScene(setup, { wrapper })`, `renderHook(cb, { wrapper })`, `cleanup()`, and
  `createTestContext().mount`.
- Docs site runs on Solid 2 through `@solidjs/vite-plugin` and the `DemoMount.astro` renderer.
- `2.0.0-rc.1` is published. `dist-tags` read `latest: 1.0.1`, `next: 2.0.0-rc.1`, so the gate held.
- `.github/workflows/npm-publish.yml` derives the dist-tag from the version, so an `-rc` cannot reach
  `latest`.
- `CONTRIBUTING.md` records the line policy and the cutover.

## Decisions

- **Leave `packages/pixi-solid-3d` in the workspace.** It is not buildable against Solid 2, so the
  root scripts must stop reaching it until it ports. Do not move the folder and do not edit the
  workspace globs.
- **Scope CI to `pixi-solid`.** Root `pnpm test` and `pnpm typecheck` are recursive. Both must be
  filtered while 3D is stale.
- **Port 3D after the v2 release, not before.** No 1.x-compatible 3D line is maintained. `0.1.0`
  stays on npm and gets deprecated once the Solid 2 release lands.
- **Adopt `main`'s workflows.** They are newer than this branch's: a publish matrix over both
  packages that skips versions already on npm, plus a fuller `ci.yml`.

## Remaining work

In order. Each stage ends with a green tree.

### Stage 1: Preserve the v1 line

`main@2df8b6d` is the last Solid 1 tree. Root overrides pin `solid-js: 1.9.15`, the package is
`1.0.1` with peer `solid-js >=1.9.10 <2`, and `pixi-solid-3d@0.1.0` peers against it. Once v2 lands
on `main`, that tree is gone.

1. **Tag `v1.0.1`** at `2df8b6d`. Only `v1.0.0` exists; 1.0.1 shipped untagged.
2. **Branch `release/v1`** from `2df8b6d` and push it. The push runs the publish workflow, which
   skips `1.0.1` because npm already has it. That is a free smoke test, not a release.
3. **Confirm `dist-tags` did not move.** `v1-latest` does not exist yet; the first v1 patch creates
   it.

### Stage 2: Stabilize this branch

4. **Remove the readme sync.** `main` deleted `scripts/sync-readme.mjs` and the `readme:sync` /
   `readme:verify` scripts in #101. This branch still has both. Git merges that badly: it keeps this
   branch's `"test": "pnpm readme:verify && pnpm -r run test"` and accepts the file deletion, so the
   script fails on a missing module. Delete `scripts/sync-readme.mjs`, drop both scripts, and set
   `"test": "pnpm -r run test"`.
5. **Bump to stable.** Root and docs dependencies to `solid-js@2.0.3`, `@solidjs/web@2.0.3`,
   `@solidjs/vite-plugin@3.0.1`. Package version `2.0.0`, peer `>=2.0.0 <3`.
6. **Update the changelog.** Rename the heading to `## 2.0.0`, and fix the peer line that still reads
   `>=2.0.0-rc.9 <3`; the published rc.1 used `rc.13`.
7. **Update the package README.** Install line becomes `npm i pixi-solid`, peer block becomes stable.
8. **Run `pnpm fmt`.** `pnpm fmt:check` fails today on `packages/pixi-solid/vite.config.ts`, and
   `main`'s CI runs it.

### Stage 3: Merge `main` into `release/v2`

`main` is 5 ahead, this branch is 20 ahead, and 21 files conflict. Resolve now, while `main` is still
unpublished. If the merge goes into `main` first, the publish fires before the tree is verified.

9. **Merge and resolve.** Regenerate `pnpm-lock.yaml`; do not hand-merge it.

    | File                                                                   | Take                                                                 |
    | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
    | `.github/workflows/npm-publish.yml`, `.github/scripts/check-published-version.mjs` | `main` — matrix over both packages, skips published versions |
    | `.github/workflows/ci.yml`                                              | `main`, then drop the two 3D steps                                    |
    | `.github/workflows/docs-build-and-publish.yml`                          | `main`, then drop the 3D build step                                    |
    | `pnpm-workspace.yaml`                                                   | Drop `solid-js: 1.9.15`; keep `pixi.js: 8.23.0` and the `@pixi/3d` exclude |
    | `README.md` (root)                                                      | `main`'s monorepo version, install line adjusted for stable           |
    | `packages/pixi-solid-docs/{package.json,astro.config.mjs}`              | This branch's, keep the Migration nav, drop the 3D deps               |
    | `docs/3d/**`, `demos/*-3d.demo.tsx`                                     | Delete, until the 3D port                                             |
    | `packages/pixi-solid/{package.json,CHANGELOG.md}`, benchmark JSONs, `components.tsx` | This branch's                                     |

    `main`'s publish matrix makes the 3D question disappear at release time: it publishes
    `pixi-solid@2.0.0` and skips `pixi-solid-3d@0.1.0`, which npm already has.

10. **Scope the recursive scripts.** In `ci.yml`, test and typecheck run `--filter pixi-solid`. The
    docs build stays, because the site deploys from `main`.
11. **Delete the 3D docs.** #101 added 13 pages under `docs/3d/` and 4 demos, plus a "3D (Beta)"
    sidebar section. The docs workflow builds `--filter pixi-solid-docs` on every push to `main`, and
    those pages import a package that cannot compile under Solid 2. Remove the pages, the demos, the
    sidebar entry, and the deps. They come back with the port.

### Stage 4: Verify

12. **Verify from a clean install.** Remove `node_modules`, install with `--frozen-lockfile`, then run
    `pnpm lint`, `pnpm fmt:check`, `pnpm --filter pixi-solid typecheck`, `pnpm --filter pixi-solid
    test`, `pnpm --filter pixi-solid build`, and `pnpm --filter pixi-solid-docs build`. The tree has
    never been built cold, and CI gates on all of it.

### Stage 5: Publish stable

13. **Merge `release/v2` into `main`.** The push publishes `2.0.0` to `latest` and skips 3D.
14. **Confirm the registry.** `npm view pixi-solid dist-tags` must read `latest: 2.0.0`,
    `next: 2.0.0-rc.1`, and no `v1-latest` yet.
15. **Check the site.** gh-pages rebuilds from `main` on the same push. Confirm the v1 pages are gone
    and the migration guide is live.
16. **Delete this file.**

### Stage 6: Port 3D

17. **Port `pixi-solid-3d` on `main`.** Swap `vite-plugin-solid` for `@solidjs/vite-plugin`, widen
    peers to `solid-js >=2.0.0 <3` and `pixi-solid >=2.0.0 <3`, fix the Solid 1 idioms, bump to
    `0.2.0`. Restore the docs pages, the demos, the sidebar section, and the CI and docs build steps.
18. **Deprecate `pixi-solid-3d@0.1.0`** with a note pointing at the Solid 2 release. Its peer range
    caps at `pixi-solid <2`, so it can never run beside v2.

## Not blocking

- `publint` and `@arethetypeswrong/cli` against the packed tarball, in CI.
- A pack-and-install smoke job, replacing the removed consumer fixture.
- An audit of components with settable instance properties that their Pixi options type omits, such
  as `AnimatedSprite.currentFrame`.
- Mirroring the benchmark suite onto `release/v1` and recording a v1-to-v2 comparison.

## Notes

- Documentation stays single-version. The site publishes to gh-pages from `main`, so the v1 pages
  leave when v2 lands. npm serves the README of the installed version, which covers v1 users.
- `CONTRIBUTING.md` says to land a workflow change on `main` first, then merge it into each release
  line. That rule breaks at cutover: `main` becomes Solid 2, so `release/v1` needs hand-carried
  copies of any later workflow fix. Record the exception when the cutover happens.
