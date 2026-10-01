import type * as Pixi3D from "@pixi/3d";

/**
 * Recursively traverses a `Container3D` hierarchy in depth-first order,
 * executing the provided callback on each node.
 *
 * @param root - The root `Container3D` node to start traversal from.
 * @param callback - Function invoked for each `Container3D` node in the tree.
 *
 * @example
 * ```ts
 * import { traverse3D } from "pixi-solid-3d";
 * import { Mesh3D } from "@pixi/3d";
 *
 * traverse3D(model, (node) => {
 *   if (node instanceof Mesh3D) {
 *     node.castShadow = true;
 *     node.receiveShadow = true;
 *   }
 * });
 * ```
 */
export const traverse3D = (
  root: Pixi3D.Container3D,
  callback: (node: Pixi3D.Container3D) => void,
): void => {
  if (!root) return;
  callback(root);

  const children = root.children;
  if (children && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      traverse3D(children[i], callback);
    }
  }
};
