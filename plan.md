# Pixi-Solid v2: Solid 2 Migration

Branch `release/v2`, baseline `26d03e1` (tag `v1.0.0`). SolidJS 2 is stable, `2.0.0-rc.1` is on npm,
and `main` has moved on. The work below carries v2 to a stable release and keeps the v1 line alive.

## Goal and policy

- `pixi-solid` v2 supports Solid 2 only. This branch carries no Solid 1 compatibility code.
- The published 1.x line stays available for Solid 1 users, on `release/v1`.
- Pin exact versions, and keep Solid external as a peer dependency.
- `pixi-solid-3d` is not released at 1.0. It stays on Solid 1 and moves to Solid 2 after v2 ships.

## Stack

| Area            | Target                                                                      | Current |
| --------------- | --------------------------------------------------------------------------- | ------- |
| Solid           | `solid-js@2.0.3`, `@solidjs/web@2.0.3`                                      | same    |
| Compiler / Vite | `@solidjs/vite-plugin@3.0.1`, Vite 8.3.0, `jsxImportSource: "@solidjs/web"` | same    |
| Docs site       | Astro 7.3.5, Starlight 0.42.4                                               | same    |
| Package         | `2.0.0`; peers `>=2.0.0 <3`                                                 | same    |
| `main`          | `2df8b6d`                                                                   | merged  |

## Progress

### Stage 1: Preserve the v1 line — done

`main@2df8b6d` is the last Solid 1 tree. Root overrides pin `solid-js: 1.9.15`, the package is
`1.0.1` with peer `solid-js >=1.9.10 <2`, and `pixi-solid-3d@0.1.0` peers against it.

- Tag `v1.0.1` pushed, pointing at `2df8b6d`.
- Branch `release/v1` pushed from `2df8b6d`.
- The push ran the publish matrix on both packages. Both skipped because npm already had `1.0.1` and
  `0.1.0`, so it was a green smoke test. `dist-tags` still read `latest: 1.0.1`, `next: 2.0.0-rc.1`.

### Stage 2: Stabilize this branch — done

- Removed the readme sync: deleted `scripts/sync-readme.mjs` and the `readme:sync` / `readme:verify`
  scripts, and restored `"test": "pnpm -r run test"`. `main` removed these in #101, and git would
  have kept the script call while accepting the file deletion.
- Bumped root and docs dependencies to `solid-js@2.0.3`, `@solidjs/web@2.0.3`, and
  `@solidjs/vite-plugin@3.0.1`. Regenerated `pnpm-lock.yaml`.
- Package version `2.0.0`, peers `>=2.0.0 <3`, changelog heading `## 2.0.0`, and the peer line that
  still claimed `rc.9` now reads `>=2.0.0 <3`.
- Package README installs with `npm i pixi-solid` and lists the stable peer range.
- Set `test.environment: "jsdom"` in `packages/pixi-solid/vite.config.ts`. `@solidjs/vite-plugin`
  3.0.1 no longer supplies the environment implicitly, so 40 context tests failed on a missing
  `document` until it was explicit.
- Green: `pnpm fmt:check`, `pnpm lint` (5 pre-existing warnings), `pnpm --filter pixi-solid
typecheck`, 182 tests, library build, docs build (55 pages).

### Stage 3: Merge `main` into `release/v2` — done

Merged locally and unresolved conflicts staged. Resolutions:

| File                                                                                 | Took                                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `.github/workflows/npm-publish.yml`, `.github/scripts/check-published-version.mjs`   | `main` — matrix over both packages, skips published versions                  |
| `.github/workflows/ci.yml`                                                           | `main`, then dropped the two 3D steps                                         |
| `.github/workflows/docs-build-and-publish.yml`                                       | `main`, then dropped the 3D build step                                        |
| `pnpm-workspace.yaml`                                                                | Dropped `solid-js: 1.9.15`; kept `pixi.js: 8.23.0` and the `@pixi/3d` exclude |
| `.npmrc`                                                                             | Dropped `auto-install-peers`; 3D's peers pull Solid 1 back in                 |
| `README.md` (root)                                                                   | `main`'s monorepo version, rewritten for the two Solid versions               |
| `packages/pixi-solid-docs/{package.json,astro.config.mjs}`                           | This branch's, kept the Migration nav, no 3D deps                             |
| `docs/3d/**`, 3D demos                                                               | Deleted, until the 3D port                                                    |
| `packages/pixi-solid/{package.json,CHANGELOG.md}`, benchmark JSONs, `components.tsx` | This branch's                                                                 |

Notes from the merge:

- The publish matrix removes the 3D publish question: it publishes `pixi-solid@2.0.0` and skips
  `pixi-solid-3d@0.1.0`, which npm already has.
- Deleted 13 pages under `docs/3d/` and 11 demos. Every one of the demos imported `pixi-solid-3d`,
  including the ones without `3d` in the name, such as `picking.demo.tsx`.
- `pnpm peers check` reports one expected warning: the 3D project resolves `solid-js@1.9.15` because
  its peer range caps at `<2`. One workspace cannot hold both Solid majors, so this stays until the
  port. It does not touch `pixi-solid`.

### Stage 4: Verify — done

From a cold tree: `node_modules` removed, `pnpm install --frozen-lockfile`, then all six checks. Every
one passed.

- `pnpm lint` — 5 pre-existing warnings, no errors.
- `pnpm fmt:check` — clean.
- `pnpm --filter pixi-solid typecheck` — clean.
- `pnpm --filter pixi-solid test` — 21 files, 193 tests.
- `pnpm --filter pixi-solid build` — clean.
- `pnpm --filter pixi-solid-docs build` — 55 pages.

Merge committed as `9dcc420`.

### Stage 5: Publish stable

Do not push `release/v2` first. A stable version on a `release/*` branch publishes to `v2-latest`.
Land on `main` first, then push the branch, so the version check skips it.

- [ ] Push the branch as `v2-stable`, which does not match the publish triggers, and open a pull
      request into `main`. CI runs on pull requests into `main`.
- [ ] Merge the pull request. The push to `main` publishes `2.0.0` to `latest` and skips 3D, and
      gh-pages rebuilds.
- [ ] Push `release/v2`. The version check then finds `2.0.0` on npm and skips, so no `v2-latest` tag
      appears. Delete `v2-stable`.
- [ ] Confirm the registry reads `latest: 2.0.0`, `next: 2.0.0-rc.1`, and no `v1-latest` yet.
- [ ] Check the site. Confirm the v1 pages are gone, the 3D pages are gone, and the migration guide
      is live.
- [ ] Delete this file.

### Stage 6: Port 3D

- [ ] Port `pixi-solid-3d` on `main`. Swap `vite-plugin-solid` for `@solidjs/vite-plugin`, widen
      peers to `solid-js >=2.0.0 <3` and `pixi-solid >=2.0.0 <3`, fix the Solid 1 idioms, bump to
      `0.2.0`. Restore `auto-install-peers` if the package still needs it, the docs pages, the demos,
      the sidebar section, and the CI and docs build steps.
- [ ] Deprecate `pixi-solid-3d@0.1.0` with a note pointing at the Solid 2 release. Its peer range
      caps at `pixi-solid <2`, so it can never run beside v2.

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
