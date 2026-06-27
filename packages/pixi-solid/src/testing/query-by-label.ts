import type * as Pixi from "pixi.js";

/**
 * Recursively search `root` for a display object with the given label.
 * Returns the first match (depth-first), or `undefined` if not found.
 *
 * @example
 * ```ts
 * const { value: scene } = mountTest(() => <GameScene />);
 * const score = queryByLabel(scene, "score");
 * ```
 */
export const queryByLabel = (
  root: Pixi.Container,
  label: string,
): Pixi.Container | undefined => {
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
 */
export const getByLabel = (root: Pixi.Container, label: string): Pixi.Container => {
  const found = queryByLabel(root, label);
  if (!found) {
    throw new Error(`getByLabel: no node with label "${label}" found in the scene graph.`);
  }
  return found;
};

/**
 * Find all display objects with the given label.
 * Useful for components that render lists of items with the same label.
 */
export const getAllByLabel = (root: Pixi.Container, label: string): Pixi.Container[] => {
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
