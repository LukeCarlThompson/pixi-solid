import type * as Pixi from "pixi.js";

/**
 * The parts of a scene node a label query needs: a label, and the children to walk.
 * `Pixi.Container` satisfies it, so the walk works on any 2D PixiJS graph.
 */
type LabelNode = {
  label?: string | null;
  children?: readonly LabelNode[];
};

/**
 * Reads a node's children.
 *
 * `LabelNode.children` is `LabelNode[]` because a walk can change node types along the way. A walk
 * over one tree of one type knows its children are that type, so it says so here once, instead of
 * every caller casting.
 */
const childrenOnNode = <Node extends LabelNode>(node: Node): readonly Node[] =>
  (node.children ?? []) as readonly Node[];

/** Depth-first search that stops at the first node carrying `label`. */
const findFirst = <Node extends LabelNode>(node: Node, label: string): Node | undefined => {
  if (node.label === label) return node;

  const children = childrenOnNode(node);
  for (let i = 0; i < children.length; i += 1) {
    const found = findFirst(children[i], label);
    if (found !== undefined) return found;
  }

  return undefined;
};

/** Depth-first visit that collects every node carrying `label`. */
const findAll = <Node extends LabelNode>(node: Node, label: string, found: Node[] = []): Node[] => {
  if (node.label === label) found.push(node);

  const children = childrenOnNode(node);
  for (let i = 0; i < children.length; i += 1) {
    findAll(children[i], label, found);
  }

  return found;
};

/**
 * Recursively search `root` for a display object with the given label.
 * Returns the first match (depth-first), or `undefined` if not found.
 *
 * Accepts `undefined` or `null` for convenience with refs — returns
 * `undefined` immediately instead of throwing.
 *
 * @example
 * ```ts
 * const { container } = mountScene(() => <Container label="scene" />);
 * const score = queryByLabel(container, "score");
 * ```
 */
export const queryByLabel = <Node extends LabelNode = Pixi.Container>(
  root: Node | undefined | null,
  label: string,
): Node | undefined => (root ? findFirst(root, label) : undefined);

/**
 * Like {@link queryByLabel} but throws if the label is not found.
 * Accepts `undefined` or `null` for convenience with refs — throws a
 * clear error if the root is missing.
 */
export const getByLabel = <Node extends LabelNode = Pixi.Container>(
  root: Node | undefined | null,
  label: string,
): Node => {
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
export const getAllByLabel = <Node extends LabelNode = Pixi.Container>(
  root: Node | undefined | null,
  label: string,
): Node[] => {
  if (!root) {
    throw new Error(
      "getAllByLabel: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to mount before querying?",
    );
  }

  return findAll(root, label);
};
