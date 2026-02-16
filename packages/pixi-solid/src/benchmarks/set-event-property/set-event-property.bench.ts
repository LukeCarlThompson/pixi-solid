import { bench, describe } from "vitest";

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

describe("setEventProperty - slice vs map", () => {
  bench("slice(2) event name", () => {
    setEventPropertyWithSlice(node as any, "onclick", handler, prevHandler);
    setEventPropertyWithSlice(node as any, "onpointerdown", handler, prevHandler);
    setEventPropertyWithSlice(node as any, "onmousemove", handler, prevHandler);
    setEventPropertyWithSlice(node as any, "onpointerup", handler, prevHandler);
  });

  bench("map lookup event name", () => {
    setEventPropertyWithMap(node as any, "onclick", handler, prevHandler);
    setEventPropertyWithMap(node as any, "onpointerdown", handler, prevHandler);
    setEventPropertyWithMap(node as any, "onmousemove", handler, prevHandler);
    setEventPropertyWithMap(node as any, "onpointerup", handler, prevHandler);
  });
});
