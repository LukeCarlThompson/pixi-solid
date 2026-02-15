import { bench, describe } from "vitest";

import { arrayLookup, setLookup } from "./point-property-lookup.variant";

describe("isPointProperty - mixed hits and misses", () => {
  bench("array includes variant", () => {
    arrayLookup("position");
    arrayLookup("tileScaleY");
    arrayLookup("invalidProp1");
    arrayLookup("anchor");
    arrayLookup("pivotY");
  });

  bench("set has variant", () => {
    setLookup("position");
    setLookup("tileScaleY");
    setLookup("invalidProp1");
    setLookup("anchor");
    setLookup("pivotY");
  });
});
