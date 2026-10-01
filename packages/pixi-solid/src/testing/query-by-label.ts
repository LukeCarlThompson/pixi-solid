import type * as Pixi from "pixi.js";

export type LabelQueryTarget =
  | {
      label?: string | null;
      children?: readonly any[] | any[];
      root?: any;
    }
  | undefined
  | null;

/**
 * Recursively search `root` for a display object with the given label.
 * Returns the first match (depth-first), or `undefined` if not found.
 *
 * Accepts `undefined` or `null` for convenience with refs — returns
 * `undefined` immediately instead of throwing.
 * Supports standard 2D `Pixi.Container`s, 3D `Container3D`s, and `View3D` (automatically
 * traverses into 3D view roots e.g. `View3D.root`).
 *
 * @example
 * ```ts
 * let scene: Pixi.Container | undefined;
 * const { container } = mountScene(() => <Container label="scene" />);
 * const score = queryByLabel(container, "score");
 * ```
 */
export const queryByLabel = <T = Pixi.Container>(
  root: LabelQueryTarget,
  label: string,
): T | undefined => {
  if (!root) return undefined;
  if (root.label === label) return root as T;

  if ("root" in root && root.root && typeof root.root === "object" && "children" in root.root) {
    const foundIn3DRoot = queryByLabel<T>(root.root, label);
    if (foundIn3DRoot) return foundIn3DRoot;
  }

  if (root.children && Array.isArray(root.children)) {
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      if (!child || typeof child !== "object") continue;

      if ("children" in child || ("root" in child && (child as any).root)) {
        const found = queryByLabel<T>(child, label);
        if (found) return found;
      }
    }
  }

  return undefined;
};

/**
 * Like {@link queryByLabel} but throws if the label is not found.
 * Accepts `undefined` or `null` for convenience with refs — throws a
 * clear error if the root is missing.
 */
export const getByLabel = <T = Pixi.Container>(root: LabelQueryTarget, label: string): T => {
  if (!root) {
    throw new Error(
      "getByLabel: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to assign the ref before querying?",
    );
  }

  const found = queryByLabel<T>(root, label);
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
 * Automatically traverses into 3D view roots (e.g. `View3D.root`) if present.
 */
export const getAllByLabel = <T = Pixi.Container>(root: LabelQueryTarget, label: string): T[] => {
  if (!root) {
    throw new Error(
      "getAllByLabel: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to mount before querying?",
    );
  }

  const results: T[] = [];

  const walk = (node: {
    label?: string | null;
    children?: readonly any[] | any[];
    root?: any;
  }): void => {
    if (node.label === label) results.push(node as unknown as T);

    if ("root" in node && node.root && typeof node.root === "object" && "children" in node.root) {
      walk(node.root);
    }

    if (node.children && Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!child || typeof child !== "object") continue;

        if ("children" in child || ("root" in child && (child as any).root)) {
          walk(child);
        }
      }
    }
  };

  walk(root);
  return results;
};
