import { bench, describe } from "vitest";

import { assignWithKeyIn, assignWithTryCatch } from "./set-prop-assignment.variant";

const createMockInstance = () => ({
  x: 0,
  y: 0,
  alpha: 1,
});

const instance = createMockInstance();

describe("setProp - key in instance vs try/catch", () => {
  bench("key in instance (existing key)", () => {
    assignWithKeyIn(instance as any, "x", 10);
    assignWithKeyIn(instance as any, "y", 20);
    assignWithKeyIn(instance as any, "alpha", 0.5);
  });

  bench("try/catch assignment (existing key)", () => {
    assignWithTryCatch(instance as any, "x", 10);
    assignWithTryCatch(instance as any, "y", 20);
    assignWithTryCatch(instance as any, "alpha", 0.5);
  });
});
