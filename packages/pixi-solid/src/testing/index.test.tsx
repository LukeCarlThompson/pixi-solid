import { onCleanup } from "solid-js";
import { describe, expect, it } from "vitest";

import { mountHeadless, withTestRoot } from "./index";

describe("testing helpers", () => {
  it("GIVEN setup throws in withTestRoot WHEN creating root THEN cleanup still runs", () => {
    let didCleanup = false;

    expect(() =>
      withTestRoot(() => {
        onCleanup(() => {
          didCleanup = true;
        });

        throw new Error("setup failed");
      }),
    ).toThrow("setup failed");

    expect(didCleanup).toBe(true);
  });

  it("GIVEN component throws in mountHeadless WHEN creating root THEN cleanup still runs", () => {
    let didCleanup = false;

    const ThrowingComponent = () => {
      onCleanup(() => {
        didCleanup = true;
      });

      throw new Error("render failed");
    };

    expect(() => mountHeadless(() => <ThrowingComponent />)).toThrow("render failed");

    expect(didCleanup).toBe(true);
  });
});
