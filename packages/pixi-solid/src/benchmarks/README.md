# Benchmark tests

This folder holds performance benchmarks, alternate implementations, and results tracking.

## Structure

- `*.bench.ts`: Benchmark suites.
- `*.variants.ts`: Alternate implementations used only by benchmarks.
- `.benchmark-results/`: Stored benchmark results and baselines.

## Workflow

### Save a baseline

```bash
pnpm test:bench:save
```

Runs all benchmarks and saves results to `.benchmark-results/baseline.json`.

### Compare against baseline

```bash
pnpm test:bench:compare
```

Runs benchmarks and compares against the saved baseline, showing regressions and improvements.

## Decision record template

For each benchmark suite, record the decision here:

- Benchmark file:
- Problem statement:
- Variants compared:
- Winner and why:
- Tradeoffs:
- Date:

## Example decision record

- Benchmark file: `point-property-lookup.bench.ts`
- Problem statement: Fastest lookup for point property names in bind-props.
- Variants compared: Array `includes` vs Set `has`.
- Winner and why: Set `has` when the list is reused across calls.
- Tradeoffs: Set creation cost; arrays may be fine for one-off lookups.
- Date: 2026-02-15
