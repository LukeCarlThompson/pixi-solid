import { test } from "vitest";

import { runBenchmarks } from "../baselines";

import { setEventPropertyWithMap, setEventPropertyWithSlice } from "./set-event-property.variant";

const createMockNode = () => ({
  addEventListener() {
    // no-op for benchmark
  },
  removeEventListener() {
    // no-op for benchmark
  },
});

const node = createMockNode();
const handler = () => undefined;
const prevHandler = () => undefined;

test("setEventProperty - slice vs map", async ({ bench }) => {
  await runBenchmarks(bench, [
    {
      name: "slice(2) event name",
      fn: () => {
        setEventPropertyWithSlice(node as any, "onclick", handler, prevHandler);
        setEventPropertyWithSlice(node as any, "onpointerdown", handler, prevHandler);
        setEventPropertyWithSlice(node as any, "onmousemove", handler, prevHandler);
        setEventPropertyWithSlice(node as any, "onpointerup", handler, prevHandler);
      },
    },
    {
      name: "map lookup event name",
      fn: () => {
        setEventPropertyWithMap(node as any, "onclick", handler, prevHandler);
        setEventPropertyWithMap(node as any, "onpointerdown", handler, prevHandler);
        setEventPropertyWithMap(node as any, "onmousemove", handler, prevHandler);
        setEventPropertyWithMap(node as any, "onpointerup", handler, prevHandler);
      },
    },
  ]);
});
