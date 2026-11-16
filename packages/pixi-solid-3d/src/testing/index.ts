import type * as Pixi3D from "@pixi/3d";
import { View3D } from "@pixi/3d";
import type * as Pixi from "pixi.js";

/**
 * Any node a scene query can visit: a 2D container, a `View3D`, or a 3D node.
 *
 * A mixed scene is one tree: 2D containers hold `View3D`s, and each `View3D` holds its 3D scene.
 * One walk covers all three kinds, so a single query finds 2D and 3D nodes in the same pass.
 */
export type SceneNode3D = Pixi.Container | View3D | Pixi3D.Container3D;

/** A scene query root, or `undefined`/`null` for a ref that was never assigned. */
export type QueryRoot3D = SceneNode3D | undefined | null;

/**
 * Walks a scene that may contain 3D.
 *
 * `View3D` is the only node with an edge the 2D walk cannot see: it mounts its 3D scene under
 * `view.root`, and refuses 2D children (`addChild` throws), so `root` is its one child to visit.
 * Every other node children through `children`, 2D and 3D alike.
 *
 * `children` is `ContainerChild[]` on 2D containers, which includes non-container children such as
 * particles. Those carry no label and no children of their own, so the walk leaves them alone; the
 * cast only states the node type the walk works in.
 */
const childrenOfScene = (node: SceneNode3D): readonly SceneNode3D[] =>
  node instanceof View3D ? [node.root] : ((node.children ?? []) as readonly SceneNode3D[]);

/**
 * Depth-first search that stops at the first node carrying `label`.
 *
 * Deliberately its own walk rather than `pixi-solid/testing`'s: the 3D graph has an edge the 2D
 * graph does not (`View3D` → `view.root`), and the node types differ. Sharing one walk would push
 * that difference into the 2D package's API.
 */
const findFirst = (node: SceneNode3D, label: string): SceneNode3D | undefined => {
  if (node.label === label) return node;

  const children = childrenOfScene(node);
  for (let i = 0; i < children.length; i += 1) {
    const found = findFirst(children[i], label);
    if (found !== undefined) return found;
  }

  return undefined;
};

/** Depth-first visit that collects every node carrying `label`. */
const findAll = (node: SceneNode3D, label: string, found: SceneNode3D[] = []): SceneNode3D[] => {
  if (node.label === label) found.push(node);

  const children = childrenOfScene(node);
  for (let i = 0; i < children.length; i += 1) {
    findAll(children[i], label, found);
  }

  return found;
};

/**
 * Search a scene for the first node with the given label, including nodes inside any `<View3D>`.
 *
 * Accepts a 2D container, a `View3D`, or a `Container3D`, and returns `undefined` when the label is
 * absent or the root was never assigned. Traversal is depth-first, and the root itself is a
 * candidate, so a labelled `<View3D>` matches its own label.
 *
 * The node type is what you say it is, the same convention as `document.querySelector<T extends
 * Element>`: the walk cannot know which class a label belongs to, so callers that need a subclass
 * name it.
 *
 * @example
 * ```ts
 * const { container } = mountScene(() => (
 *   <Container label="hud">
 *     <Sprite label="score" />
 *     <View3D>
 *       <Mesh3D label="crate" />
 *     </View3D>
 *   </Container>
 * ));
 *
 * queryByLabel3D(container, "score"); // the Sprite
 * queryByLabel3D(container, "crate"); // the Mesh3D, inside the view
 * ```
 */
export const queryByLabel3D = <Node extends SceneNode3D = SceneNode3D>(
  root: QueryRoot3D,
  label: string,
): Node | undefined => (root ? (findFirst(root, label) as Node | undefined) : undefined);

/**
 * Like {@link queryByLabel3D} but throws if the label is not found, or if the root is missing.
 */
export const getByLabel3D = <Node extends SceneNode3D = SceneNode3D>(
  root: QueryRoot3D,
  label: string,
): Node => {
  if (!root) {
    throw new Error(
      "getByLabel3D: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to assign the ref before querying?",
    );
  }

  const found = queryByLabel3D<Node>(root, label);
  if (!found) {
    throw new Error('getByLabel3D: no node with label "' + label + '" found in the scene graph.');
  }
  return found;
};

/**
 * Find every node with the given label, in depth-first order, including nodes inside any
 * `<View3D>`. Useful for nodes a component renders in a list.
 */
export const getAllByLabel3D = <Node extends SceneNode3D = SceneNode3D>(
  root: QueryRoot3D,
  label: string,
): Node[] => {
  if (!root) {
    throw new Error(
      "getAllByLabel3D: root is " +
        (root === undefined ? "undefined" : "null") +
        ". Did you forget to mount before querying?",
    );
  }

  return findAll(root, label) as Node[];
};
