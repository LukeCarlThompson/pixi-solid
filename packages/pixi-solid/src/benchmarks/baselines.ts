import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import type { Bench, BenchFn } from "vitest";

const RESULTS_DIR = path.resolve(import.meta.dirname, "results");
const RELATIVE_RESULTS_DIR = "src/benchmarks/results";

/**
 * Baseline recording is opt-in so a normal run only compares against the
 * committed baselines instead of overwriting them.
 */
const isSaving = process.env.BENCH_SAVE === "1";

const fileName = (name: string) =>
  `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.json`;

const absolutePath = (name: string) => path.join(RESULTS_DIR, fileName(name));

const relativePath = (name: string) => `${RELATIVE_RESULTS_DIR}/${fileName(name)}`;

type Benchmark = {
  name: string;
  fn: BenchFn;
};

/**
 * Runs a group of benchmarks, folding in any committed baseline with the same
 * name so the reporter prints a current-vs-baseline table.
 *
 * Baselines live in `src/benchmarks/results/<name>.json` and are machine
 * specific: record them on a stable machine with `BENCH_SAVE=1` (the
 * `test:bench:save` script) and commit the JSON; later `test:bench` runs compare
 * against them.
 */
export const runBenchmarks = async (bench: Bench, benchmarks: Benchmark[]): Promise<void> => {
  if (isSaving) mkdirSync(RESULTS_DIR, { recursive: true });

  const registrations = benchmarks.map(({ name, fn }) =>
    bench(name, isSaving ? { writeResult: relativePath(name) } : {}, fn),
  );

  const baselines = registrations
    .map((registration) =>
      existsSync(absolutePath(registration.name))
        ? bench.from(registration.name, relativePath(registration.name))
        : undefined,
    )
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

  // `bench.compare` requires two registrations; with a single benchmark and no
  // recorded baseline, just run it.
  if (registrations.length + baselines.length < 2) {
    await registrations[0].run();
    return;
  }

  await bench.compare(...registrations, ...baselines);
};
