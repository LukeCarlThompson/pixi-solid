import {
  createRenderEffect,
  createRoot,
  createSignal,
  flush,
  getOwner,
  resetErrorHalt,
} from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { applyRef } from "./apply-ref";

afterEach(() => {
  resetErrorHalt();
});

describe("applyRef()", () => {
  it("GIVEN a callback ref WHEN applied THEN it receives the value and runs without an owner", () => {
    const instance = { id: 1 };
    const seen: Array<{ value: unknown; owner: unknown }> = [];

    const dispose = createRoot((disposeRoot) => {
      applyRef((value: unknown) => {
        seen.push({ value, owner: getOwner() });
      }, instance);

      return disposeRoot;
    });

    expect(seen).toEqual([{ value: instance, owner: null }]);
    dispose();
  });

  it("GIVEN an array of refs WHEN applied THEN every callback runs and nullish entries are skipped", () => {
    const first = vi.fn();
    const second = vi.fn();
    const third = vi.fn();

    createRoot((disposeRoot) => {
      applyRef([first, null, [second, undefined, [third]]], "value");
      return disposeRoot;
    })();

    for (const callback of [first, second, third]) {
      expect(callback).toHaveBeenCalledWith("value");
    }
  });

  it("GIVEN a non-callback ref value WHEN applied THEN it is ignored without throwing", () => {
    // `Ref<T>` admits a direct `T`, and the compiler turns `ref={variable}` into a
    // callback. A bare value reaching here is a mistake, so ignore it rather than throw.
    expect(() =>
      createRoot((disposeRoot) => {
        applyRef({ not: "a callback" }, "value");
        return disposeRoot;
      })(),
    ).not.toThrow();
  });

  it("GIVEN a ref callback reading a signal WHEN the signal changes THEN the callback does not re-run", () => {
    const [size, setSize] = createSignal(10);
    const runs: number[] = [];

    const dispose = createRoot((disposeRoot) => {
      // Mirror how pixi-solid applies a ref: from an effect's apply function.
      createRenderEffect(
        () => null,
        () => {
          applyRef(() => {
            runs.push(size());
          }, {});
        },
      );

      return disposeRoot;
    });

    flush();
    setSize(20);
    flush();

    expect(runs).toEqual([10]);
    dispose();
  });
});
