import { Container as PixiContainer, Text as PixiText } from "pixi.js";

import type { FederatedEventMap } from "pixi.js";
import { createRenderEffect } from "solid-js";
import { createRenderer } from "solid-js/universal";
import { pixiEvents } from "./pixi-events";

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
  /**
   * Renders a Solid Pixi application
   * Handles cleanup and disposal of rendered elements.
   *
   * @param code - A function that returns a JSX element to render
   * @returns A dispose function that cleans up the rendered element
   */
  render,
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
  setProperty(node, name, value, _prev) {
    // Check for event listeners and handle them appropriately.
    if (name.startsWith("on")) {
      const eventName = name.slice(2).toLowerCase();
      // Validate that it's a known PixiJS event
      if (pixiEvents.has(eventName as keyof FederatedEventMap)) {
        if (_prev) {
          node.removeEventListener(eventName, _prev as any);
        }
        node.addEventListener(eventName, value as any);
        return;
      }
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
    // Handle the ref prop first.
    if ("ref" in props && typeof (props as any).ref === "function") {
      (props as any).ref(node);
    }
    for (const key in props) {
      if (key !== "children" && key !== "ref") {
        setProp(node, key, props[key as keyof T]);
      }
    }
  });
}
