import { Application, Container as PixiContainer, Text as PixiText } from "pixi.js";

import { createRenderEffect } from "solid-js";
import { createRenderer } from "solid-js/universal";
import { solidPixiEvents } from "./pixi-events";

export const {
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  setProp,
  mergeProps,
  use,
} = createRenderer<PixiContainer>({
  createElement(name: string) {
    // This function is for lowercase string tags like `<container />`.
    // To support tree-shaking, we require users to import components
    // directly and use them with an uppercase name like `<Container />`,
    // which does not call this function.
    throw new Error(
      `Cannot create element "${name}". Please import components directly from 'pixi-solid' and use them with a capital letter.`
    );
  },
  createTextNode(value) {
    return new PixiText({ text: value });
  },
  replaceText(textNode: PixiText, value) {
    textNode.text = value;
  },
  setProperty(node, name, value, prev) {
    // Check for event listeners and handle them appropriately.
    if (solidPixiEvents.has(name)) {
      const eventName = name.slice(2).toLowerCase();
      // Validate that it's a known PixiJS event
      if (node instanceof Application) {
        if (prev) {
          node.stage.removeEventListener(eventName, prev as any);
        }
        node.stage.addEventListener(eventName, value as any);
        return;
      }
      if (prev) {
        node.removeEventListener(eventName, prev as any);
      }
      node.addEventListener(eventName, value as any);
      return;
    }

    if (name in node) {
      (node as any)[name] = value;
      return;
    }
  },
  insertNode(parent, node, anchor) {
    // RenderLayer uses `attach` instead of `addChild`.
    // We check for its existence and use it if available.
    if ("attach" in parent && typeof parent.attach === "function") {
      parent.attach(node);
      // Note: `attach` does not support anchoring, so we ignore the anchor.
      return;
    }

    // Check for the existence of addChild methods instead of a specific class.
    // This automatically supports Container, ParticleContainer, RenderLayer, etc.
    if (typeof (parent as any).addChild !== "function") {
      throw new Error("Parent does not support children.");
    }

    if (anchor) {
      parent.addChildAt(node, parent.children.indexOf(anchor));
    } else {
      parent.addChild(node);
    }
  },
  isTextNode(node) {
    return node instanceof PixiText;
  },
  removeNode(_, node) {
    node?.removeFromParent();
  },
  getParentNode(node) {
    return node?.parent ?? undefined;
  },
  getFirstChild(node) {
    return node?.children?.[0];
  },
  getNextSibling(node) {
    if (!node.parent) return undefined;
    const index = node.parent.children.indexOf(node);
    // Return the next child if it exists, otherwise undefined.
    return index > -1 ? node.parent.children[index + 1] : undefined;
  },
});

/**
 * A simplified and reactive spread function for applying props to a PixiJS instance.
 * @param node The PixiJS instance to apply props to.
 * @param accessor A function that returns the props object.
 */
export function spread<T extends object>(node: any, accessor: () => T) {
  createRenderEffect(() => {
    const props = accessor();
    for (const key in props) {
      // The 'ref' prop is special and is handled by Solid's compiler and runtime.
      // We assign it directly to the node. Other props are set via setProp.
      if (key === "ref") {
        (props as any)[key](node);
      } else if (key !== "children") {
        setProp(node, key, props[key as keyof T]);
      }
    }
  });
}
