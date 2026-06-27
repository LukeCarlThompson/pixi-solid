import type * as Pixi from "pixi.js";

type MaybeContainer = Pixi.Container | undefined | null;

/**
 * Recursively search `root` for a display object with the given label.
 * Returns the first match (depth-first), or `undefined` if not found.
 *
 * Accepts `undefined` or `null` for convenience with refs — returns
 * `undefined` immediately instead of throwing.
 *
 * @example
 * ```ts
 * let scene: Pixi.Container | undefined;
 * const { container } = mountScene(() => <Container label="scene" />);
 * const score = queryByLabel(container, "score");
 * ```
 */
export const queryByLabel = (
  root: MaybeContainer,
  label: string,
): Pixi.Container | undefined => {
  if (!root) return undefined;
  if (root.label === label) return root;

  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (!("children" in child)) continue;

    const found = queryByLabel(child as Pixi.Container, label);
    if (found) return found;
  }

  return undefined;
};

/**
 * Like {@link queryByLabel} but throws if the label is not found.
 * Accepts `undefined` or `null` for convenience with refs — throws a
 * clear error if the root is missing.
 */
export const getByLabel = (root: MaybeContainer, label: string): Pixi.Container => {
  if (!root) {
    throw new Error(
      "getByLabel: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to assign the ref before querying?",
    );
  }

  const found = queryByLabel(root, label);
  if (!found) {
    throw new Error('getByLabel: no node with label "' + label + '" found in the scene graph.');
  }
  return found;
};

/**
 * Find all display objects with the given label.
 * Useful for components that render lists of items with the same label.
 * Accepts `undefined` or `null` for convenience with refs — throws a
 * clear error if the root is missing.
 */
export const getAllByLabel = (
  root: MaybeContainer,
  label: string,
): Pixi.Container[] => {
  if (!root) {
    throw new Error(
      "getAllByLabel: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to mount before querying?",
    );
  }

  const results: Pixi.Container[] = [];

  const walk = (node: Pixi.Container): void => {
    if (node.label === label) results.push(node);

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if ("children" in child) {
        walk(child as Pixi.Container);
      }
    }
  };

  walk(root);
  return results;
};
