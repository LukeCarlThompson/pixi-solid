import { test } from "vitest";

import { runBenchmarks } from "../baselines";

import { assignWithKeyIn, assignWithTryCatch } from "./set-prop-assignment.variant";

const createMockInstance = () => ({
  x: 0,
  y: 0,
  alpha: 1,
});

const instance = createMockInstance();

test("setProp - key in instance vs try/catch", async ({ bench }) => {
  await runBenchmarks(bench, [
    {
      name: "key in instance (existing key)",
      fn: () => {
        assignWithKeyIn(instance as any, "x", 10);
        assignWithKeyIn(instance as any, "y", 20);
        assignWithKeyIn(instance as any, "alpha", 0.5);
      },
    },
    {
      name: "try/catch assignment (existing key)",
      fn: () => {
        assignWithTryCatch(instance as any, "x", 10);
        assignWithTryCatch(instance as any, "y", 20);
        assignWithTryCatch(instance as any, "alpha", 0.5);
      },
    },
  ]);
});
