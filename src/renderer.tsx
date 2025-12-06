import type { Container as PixiContainer } from "pixi.js";
import { Text as PixiText } from "pixi.js";
import { createRenderer } from "solid-js/universal";
import type { PIXI_EVENT_NAMES, PixiEventHandlerMap } from "./pixi-events";
import { PIXI_EVENT_HANDLER_NAME_SET } from "./pixi-events";

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
  render,
  spread,
} = createRenderer<PixiContainer>({
  createElement(name: string) {
    // This function is for lowercase string tags like `<container />`.
    // To support tree-shaking, we require users to import components
    // directly and use them with an uppercase name like `<Container />`,
    // which does not call this function.
    throw new Error(
      `Cannot create element "${name}". Please import components directly from 'pixi-solid' and use them with a capital letter.`,
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
    if (PIXI_EVENT_HANDLER_NAME_SET.has(name as keyof PixiEventHandlerMap)) {
      // Remove the 'on' prefix to get the actual event name.
      const eventName = name.slice(2) as (typeof PIXI_EVENT_NAMES)[number];

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
    if ("attach" in parent && typeof parent.attach === "function") {
      parent.attach(node);
      // Note: `attach` does not support anchoring, so we ignore the anchor.
      return;
    }

    if (
      !("addChildAt" in parent) ||
      !("addChild" in parent) ||
      typeof parent.addChild !== "function"
    ) {
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
    node.removeFromParent();
    node.destroy({ children: true });
  },
  getParentNode(node) {
    return node?.parent ?? undefined;
  },
  getFirstChild(node) {
    return node.children?.[0];
  },
  getNextSibling(node) {
    if (!node.parent) return undefined;
    const index = node.parent.children.indexOf(node);
    // Return the next child if it exists, otherwise undefined.
    return index > -1 ? node.parent.children[index + 1] : undefined;
  },
});
