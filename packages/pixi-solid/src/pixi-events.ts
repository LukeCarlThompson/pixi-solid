import type { FederatedEventEmitterTypes } from "pixi.js";

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

export const PIXI_SOLID_EVENT_HANDLER_NAMES = PIXI_EVENT_NAMES.map(
  (eventName) => `on${eventName}` as const,
);

export type PixiEventHandlerMap = {
  [K in (typeof PIXI_EVENT_NAMES)[number] as `on${K}`]?:
    | null
    | ((...args: FederatedEventEmitterTypes[K]) => void);
};

export const PIXI_EVENT_HANDLER_NAME_SET: Readonly<
  Set<(typeof PIXI_SOLID_EVENT_HANDLER_NAMES)[number]>
> = new Set(PIXI_SOLID_EVENT_HANDLER_NAMES);

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
