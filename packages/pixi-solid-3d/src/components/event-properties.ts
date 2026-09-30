import type * as Pixi3D from "@pixi/3d";

export type PixiSolid3DEventMap = Pixi3D.FederatedEventMap3D & Pixi3D.GlobalFederatedEventMap3D;

export const PIXI_3D_EVENT_NAMES = [
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

export const PIXI_SOLID_3D_EVENT_HANDLER_NAMES = PIXI_3D_EVENT_NAMES.map(
  (eventName) => `on${eventName}` as const,
);

export type PixiSolid3DEventHandlerName = (typeof PIXI_SOLID_3D_EVENT_HANDLER_NAMES)[number];

export type PixiSolid3DEventHandlerMap = {
  [K in (typeof PIXI_3D_EVENT_NAMES)[number] as `on${K}`]?: (event: PixiSolid3DEventMap[K]) => void;
};

export const PIXI_SOLID_3D_EVENT_HANDLER_NAMES_SET: Set<string> = new Set(
  PIXI_SOLID_3D_EVENT_HANDLER_NAMES,
);

export const is3DEventProperty = (propName: string): propName is PixiSolid3DEventHandlerName =>
  PIXI_SOLID_3D_EVENT_HANDLER_NAMES_SET.has(propName);
