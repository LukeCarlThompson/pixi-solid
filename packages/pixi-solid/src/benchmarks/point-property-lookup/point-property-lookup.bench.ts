import { test } from "vitest";

import { runBenchmarks } from "../baselines";

import { arrayLookup, setLookup } from "./point-property-lookup.variant";

test("isPointProperty - mixed hits and misses", async ({ bench }) => {
  await runBenchmarks(bench, [
    {
      name: "array includes variant",
      fn: () => {
        arrayLookup("position");
        arrayLookup("tileScaleY");
        arrayLookup("invalidProp1");
        arrayLookup("anchor");
        arrayLookup("pivotY");
      },
    },
    {
      name: "set has variant",
      fn: () => {
        setLookup("position");
        setLookup("tileScaleY");
        setLookup("invalidProp1");
        setLookup("anchor");
        setLookup("pivotY");
      },
    },
  ]);
});
