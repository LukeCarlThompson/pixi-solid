/**
 * Absolute href for a route path, including the deployment base.
 *
 * Solid Router's `Location` is base-relative, so plain anchors must add the base themselves;
 * `useHref` does not do it.
 */
export const href = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
