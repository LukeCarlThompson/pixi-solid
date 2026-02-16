import type { PixiEventHandlerName } from "./event-names";
import { PIXI_EVENT_HANDLER_NAME_SET } from "./event-names";

export const isEventProperty = (name: string): name is PixiEventHandlerName =>
  PIXI_EVENT_HANDLER_NAME_SET.has(name);
