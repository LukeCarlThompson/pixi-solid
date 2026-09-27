import { flush } from "solid-js";

export type WaitForOptions = {
  /** Maximum time to wait in milliseconds. Defaults to 1000. */
  timeout?: number;
  /**
   * Extra delay between attempts in milliseconds. Defaults to 0, which yields
   * to the macrotask queue once per attempt.
   */
  interval?: number;
};

/**
 * Wait until `callback` stops throwing.
 *
 * Solid 2 batches reactive writes and flushes them on a microtask, so an
 * assertion that runs immediately after a write can observe the previous
 * value. `waitFor` flushes Solid and yields to the event loop between
 * attempts, which removes the need for manual `flush()` calls in tests. It is
 * the pixi-solid equivalent of a testing-library `waitFor`.
 *
 * @example
 * ```tsx
 * const [x, setX] = createSignal(0);
 * const { container } = mountScene(() => <Sprite x={x()} />);
 *
 * setX(100);
 * await waitFor(() => expect(container.x).toBe(100));
 * ```
 */
export const waitFor = async (
  callback: () => void | Promise<void>,
  options?: WaitForOptions,
): Promise<void> => {
  const timeout = options?.timeout ?? 1000;
  const interval = options?.interval ?? 0;
  const start = Date.now();
  let lastError: unknown;

  for (;;) {
    flush();
    await Promise.resolve();

    try {
      await callback();
      return;
    } catch (error) {
      lastError = error;
    }

    if (Date.now() - start >= timeout) {
      throw lastError;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, interval));
  }
};
