# Benchmark tests

This folder holds performance benchmarks, alternate implementations, and results tracking.

## Structure

- `*.bench.ts`: Benchmark suites.
- `*.variants.ts`: Alternate implementations used only by benchmarks.
- `.results/`: Stored benchmark results and baselines.

## Workflow

### Save a baseline

```bash
pnpm test:bench:save
```

Runs all benchmarks and saves results to `.results/baseline.json`.

### Compare against baseline

```bash
pnpm test:bench:compare
```

Runs benchmarks and compares against the saved baseline, showing regressions and improvements.
