import { Filter } from "pixi.js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mountHeadless } from "../testing";

import { createFilterComponent } from "./component-factories";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createFilterComponent cleanup", () => {
  it("GIVEN a filter component WHEN root is disposed THEN instance is destroyed", () => {
    const TestFilter = createFilterComponent<Filter, object>(Filter);

    let filterRef: Filter | undefined;
    let destroyCalled = false;

    const dispose = mountHeadless(() => (
      <TestFilter
        ref={(el) => {
          filterRef = el;
          const originalDestroy = el.destroy.bind(el);
          el.destroy = vi.fn(() => {
            destroyCalled = true;
            originalDestroy();
          });
        }}
      />
    ));

    expect(filterRef).toBeDefined();

    dispose();

    expect(destroyCalled).toBe(true);
  });
});
