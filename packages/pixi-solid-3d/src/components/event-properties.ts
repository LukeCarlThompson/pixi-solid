import type * as Pixi3D from "@pixi/3d";

/** Pointer events a `Container3D` emits on the node the pointer hit. */
const FEDERATED_3D_EVENT_NAMES = [
  "click",
  "contextmenu",
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
] as const;

/** Pointer moves a `View3D` emits whatever the pointer is over. */
const GLOBAL_3D_EVENT_NAMES = ["globalmousemove", "globalpointermove", "globaltouchmove"] as const;

/**
 * All PixiJS 3D event names that pixi-solid-3d supports as component props.
 *
 * The capture-phase variants (`pointerdowncapture`, ...) come from the federated events; the
 * `global*` moves have no capture phase.
 */
export const PIXI_3D_EVENT_NAMES = [
  ...FEDERATED_3D_EVENT_NAMES,
  ...FEDERATED_3D_EVENT_NAMES.map((eventName) => `${eventName}capture` as const),
  ...GLOBAL_3D_EVENT_NAMES,
] as const;

export type Pixi3DEventName = (typeof PIXI_3D_EVENT_NAMES)[number];

/**
 * This is a type-safe check that ensures `PIXI_3D_EVENT_NAMES` includes every event
 * `@pixi/3d` emits. It fails the build when a `@pixi/3d` upgrade adds an event that is missing
 * here, so a handler prop can never be silently dropped again.
 */
type Missing3DEventKeys = Exclude<keyof Pixi3D.FederatedEventEmitterTypes3D, Pixi3DEventName>;
type All3DEventsAreHandled = Missing3DEventKeys extends never
  ? true
  : `Error: Missing 3D event keys: ${Missing3DEventKeys}`;
const all3DEventsAreHandled: All3DEventsAreHandled = true;
void all3DEventsAreHandled;

export const PIXI_SOLID_3D_EVENT_HANDLER_NAMES = PIXI_3D_EVENT_NAMES.map(
  (eventName) => `on${eventName}` as const,
);

export type PixiSolid3DEventHandlerName = (typeof PIXI_SOLID_3D_EVENT_HANDLER_NAMES)[number];

export const PIXI_SOLID_3D_EVENT_HANDLER_NAMES_SET: Set<string> = new Set(
  PIXI_SOLID_3D_EVENT_HANDLER_NAMES,
);

export const is3DEventProperty = (propName: string): propName is PixiSolid3DEventHandlerName =>
  PIXI_SOLID_3D_EVENT_HANDLER_NAMES_SET.has(propName);

/** Kept for the event payload types a handler receives. */
export type PixiSolid3DEventMap = Pixi3D.FederatedEventMap3D & Pixi3D.GlobalFederatedEventMap3D;

/** Maps each `@pixi/3d` event to an optional SolidJS event handler prop. */
export type PixiSolid3DEventHandlerMap = {
  [K in Pixi3DEventName as `on${K}`]?: (...args: Pixi3D.FederatedEventEmitterTypes3D[K]) => void;
};
