import type { AllFederatedEventMap } from "pixi.js";

const pixiEventNames = [
  "click",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "mouseupoutside",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointertap",
  "pointerup",
  "pointerupoutside",
  "rightclick",
  "rightdown",
  "rightup",
  "rightupoutside",
  "tap",
  "touchcancel",
  "touchend",
  "touchendoutside",
  "touchmove",
  "touchstart",
  "wheel",
  "globalmousemove",
  "globalpointermove",
  "globaltouchmove",
] as const;

// This is a type-safe check that ensures `pixiEventNames` includes every key from `AllFederatedEventMap`.
// It will cause a build error if any event names are missing.
type MissingKeys = Exclude<keyof AllFederatedEventMap, (typeof pixiEventNames)[number]>;
type AllEventsAreHandled = MissingKeys extends never ? true : `Error: Missing event keys: ${MissingKeys}`;
const allEventsAreHandled: AllEventsAreHandled = true;
void allEventsAreHandled;

export const pixiEvents = new Set(pixiEventNames);
