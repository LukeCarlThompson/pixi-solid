import { Filter } from "pixi.js";
import { createRoot } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NoMount } from "../testing";

import { createFilterComponent } from "./component-factories";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createFilterComponent cleanup", () => {
  it("GIVEN a filter component WHEN root is disposed THEN instance is destroyed", () => {
    const TestFilter = createFilterComponent<Filter, object>(Filter);

    let filterRef: Filter | undefined;
    let destroyCalled = false;

    createRoot((dispose) => {
      const TestComponent = () => {
        return (
          <NoMount>
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
          </NoMount>
        );
      };

      TestComponent();

      expect(filterRef).toBeDefined();

      dispose();

      expect(destroyCalled).toBe(true);
    });
  });
});
