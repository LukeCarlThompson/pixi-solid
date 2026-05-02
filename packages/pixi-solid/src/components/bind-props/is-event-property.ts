import type { PixiSolidEventHandlerName } from "./event-names";
import { PIXI_SOLID_EVENT_HANDLER_NAME_SET } from "./event-names";

export const isEventProperty = (name: string): name is PixiSolidEventHandlerName =>
  PIXI_SOLID_EVENT_HANDLER_NAME_SET.has(name);
