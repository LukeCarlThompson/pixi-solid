import type { FederatedEventEmitterTypes } from "pixi.js";

/** All PixiJS federated event names that pixi-solid supports as component props. */
export const PIXI_EVENT_NAMES: (keyof FederatedEventEmitterTypes)[] = [
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
  "clickcapture",
  "mousedowncapture",
  "mouseentercapture",
  "mouseleavecapture",
  "mousemovecapture",
  "mouseoutcapture",
  "mouseovercapture",
  "mouseupcapture",
  "mouseupoutsidecapture",
  "pointercancelcapture",
  "pointerdowncapture",
  "pointerentercapture",
  "pointerleavecapture",
  "pointermovecapture",
  "pointeroutcapture",
  "pointerovercapture",
  "pointertapcapture",
  "pointerupcapture",
  "pointerupoutsidecapture",
  "rightclickcapture",
  "rightdowncapture",
  "rightupcapture",
  "rightupoutsidecapture",
  "tapcapture",
  "touchcancelcapture",
  "touchendcapture",
  "touchendoutsidecapture",
  "touchmovecapture",
  "touchstartcapture",
  "wheelcapture",
] as const;

/** SolidJS-compatible event handler prop names (e.g. `"onpointerdown"`, `"onclick"`). */
export const PIXI_SOLID_EVENT_HANDLER_NAMES = PIXI_EVENT_NAMES.map(
  (eventName) => `on${eventName}` as const,
);

/** A single pixi-solid event handler prop name, e.g. `"onpointerdown"`. */
export type PixiSolidEventHandlerName = (typeof PIXI_SOLID_EVENT_HANDLER_NAMES)[number];

/** Maps each PixiJS event to an optional SolidJS event handler prop, typed to Pixi's event payloads. */
export type PixiSolidEventHandlerMap = {
  [K in (typeof PIXI_EVENT_NAMES)[number] as `on${K}`]?:
    | null
    | ((...args: FederatedEventEmitterTypes[K]) => void);
};

export const PIXI_SOLID_EVENT_HANDLER_NAME_SET: Set<string> = new Set(
  PIXI_SOLID_EVENT_HANDLER_NAMES,
);

/**
 * This is a type-safe check that ensures `PIXI_EVENT_NAMES` includes every key from Pixi's `AllFederatedEventMap` type.
 * It will cause a build error if any event names are missing.
 */
type MissingKeys = Exclude<keyof FederatedEventEmitterTypes, (typeof PIXI_EVENT_NAMES)[number]>;
type AllEventsAreHandled = MissingKeys extends never
  ? true
  : `Error: Missing event keys: ${MissingKeys}`;
const allEventsAreHandled: AllEventsAreHandled = true;
void allEventsAreHandled;
