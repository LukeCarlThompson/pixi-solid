import type * as Pixi from "pixi.js";

import {
  PIXI_EVENT_NAMES,
  PIXI_SOLID_EVENT_HANDLER_NAMES,
} from "../../components/bind-props/event-names";

const EVENT_NAME_BY_HANDLER = PIXI_SOLID_EVENT_HANDLER_NAMES.reduce((map, handlerName, index) => {
  map.set(handlerName, PIXI_EVENT_NAMES[index]);
  return map;
}, new Map<string, (typeof PIXI_EVENT_NAMES)[number]>());

export const setEventPropertyWithSlice = (
  node: Pixi.Container,
  name: string,
  eventHandler: any,
  prevEventHandler?: any,
): void => {
  const eventName = name.slice(2) as (typeof PIXI_EVENT_NAMES)[number];

  if (prevEventHandler) {
    node.removeEventListener(eventName, prevEventHandler);
  }
  node.addEventListener(eventName, eventHandler);
};

export const setEventPropertyWithMap = (
  node: Pixi.Container,
  name: string,
  eventHandler: any,
  prevEventHandler?: any,
): void => {
  const eventName = EVENT_NAME_BY_HANDLER.get(name);
  if (!eventName) {
    return;
  }

  if (prevEventHandler) {
    node.removeEventListener(eventName, prevEventHandler);
  }
  node.addEventListener(eventName, eventHandler);
};
