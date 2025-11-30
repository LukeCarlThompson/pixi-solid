import type { FederatedEventMap } from "pixi.js";

const pixiEventNames: (keyof FederatedEventMap)[] = [
  "click",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseupoutside",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerupoutside",
  "tap",
  "touchstart",
  "touchend",
  "touchmove",
  "touchendoutside",
  "wheel",
];

export const pixiEvents = new Set(pixiEventNames);
