# Benchmark tests

This folder holds performance benchmarks, alternate implementations, and the committed baselines.

## Structure

- `*.bench.ts` / `*.bench.tsx`: Benchmark suites.
- `*.variant.ts`: Alternate implementations used only by benchmarks.
- `baselines.ts`: Shared runner that records and loads baselines.
- `results/*.json`: Committed baseline results.

## Workflow

Vitest 5's benchmark API is a fixture on the test context: `bench` is passed to
the test callback and each benchmark is registered with `bench(name, fn)`.
`runBenchmarks` (in `baselines.ts`) registers the benchmarks, folds in any
committed baseline with the same name, and runs them together:

```ts
import { test } from "vitest";

import { runBenchmarks } from "../baselines";

test("compare implementations", async ({ bench }) => {
  await runBenchmarks(bench, [
    { name: "variant a", fn: () => variantA() },
    { name: "variant b", fn: () => variantB() },
  ]);
});
```

Compare the current run against the committed baselines:

```bash
pnpm test:bench
```

Record or refresh the baselines (writes `src/benchmarks/results/*.json`):

```bash
pnpm test:bench:save
```

Both scripts run `vitest bench --environment jsdom`: these benchmarks exercise Pixi
components, and under Vitest's default `node` environment Solid's dev build emits
a `STRICT_READ_UNTRACKED` warning per iteration, which floods the output. The
`--reporter=verbose` flag is what prints the comparison tables.

Then commit the updated JSON. Baselines are machine specific, so record them on a
stable machine (or CI) and treat a large delta as something to investigate, not
as a pass/fail gate.

This replaces the old `vitest bench --outputJson` / `--compare` flags, which no
longer exist: `bench(name, { writeResult }, fn)` persists a result and
`bench.from(name, path)` loads it into `bench.compare(...)`.
