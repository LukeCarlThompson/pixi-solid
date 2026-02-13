import type * as Pixi from "pixi.js";

import type { PIXI_EVENT_NAMES } from "./event-names";
import { PIXI_EVENT_HANDLER_NAME_SET } from "./event-names";

export const isEventProperty = (name: string): boolean => PIXI_EVENT_HANDLER_NAME_SET.has(name);

export const setEventProperty = (
  node: Pixi.Container,
  name: string,
  eventHandler: any,
  prevEventHandler?: any,
): void => {
  // Remove the 'on' prefix to get the actual event name.
  const eventName = name.slice(2) as (typeof PIXI_EVENT_NAMES)[number];

  if (prevEventHandler) {
    node.removeEventListener(eventName, prevEventHandler);
  }
  node.addEventListener(eventName, eventHandler);
};
