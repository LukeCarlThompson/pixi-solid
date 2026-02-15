import type * as Pixi from "pixi.js";

import type { PixiEventHandlerName } from "./event-names";
import { PIXI_EVENT_HANDLER_NAME_SET } from "./event-names";

export const isEventProperty = (name: string): name is PixiEventHandlerName =>
  PIXI_EVENT_HANDLER_NAME_SET.has(name);

// TODO: Can we get stricter typing for the event handler? We know the event type based on the event name, but it would require a more complex mapping of event names to event types.
export const setEventProperty = (
  node: Pixi.Container,
  name: PixiEventHandlerName,
  eventHandler: any,
  prevEventHandler?: any,
): ((event: Pixi.FederatedPointerEvent) => void | undefined) => {
  // Remove the 'on' prefix to get the actual event name.
  const eventName = name.slice(2);

  if (prevEventHandler) {
    node.removeEventListener(eventName, prevEventHandler);
  }
  if (eventHandler) {
    node.addEventListener(eventName, eventHandler);
  }

  return eventHandler;
};
