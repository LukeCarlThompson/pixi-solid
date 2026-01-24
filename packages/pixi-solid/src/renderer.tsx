import type * as Pixi from "pixi.js";
import { Text as PixiText } from "pixi.js";
import { createRenderer } from "solid-js/universal";
import { isEventProperty, setEventProperty } from "./set-event-property";
import { isPointProperty, setPointProperty } from "./set-point-property";

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
} = createRenderer<Pixi.Container>({
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
    if (isPointProperty(name)) {
      setPointProperty(node, name, value);
      return;
    }

    if (name in node) {
      (node as any)[name] = value;
      return;
    }

    if (isEventProperty(name)) {
      setEventProperty(node, name, value, prev);
    }
  },
  insertNode(parent, node, anchor) {
    // RenderLayer uses `attach` instead of `addChild`.
    if ("attach" in parent && typeof parent.attach === "function") {
      parent.attach(node);
      // Note: `attach` does not support anchoring, so we ignore the anchor.
      return;
    }

    if (!("addChildAt" in parent) || !("addChild" in parent) || typeof parent.addChild !== "function") {
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
    // RenderLayer uses `detach` instead of `removeChild`.
    if ("detach" in parent && typeof parent.detach === "function") {
      parent.detach(node);
      return;
    }

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
