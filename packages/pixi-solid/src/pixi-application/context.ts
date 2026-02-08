import type * as Pixi from "pixi.js";
import { createContext } from "solid-js";
import type { PixiScreenDimensions } from "../use-pixi-screen/pixi-screen-store";

export const PixiAppContext = createContext<{
  app: Pixi.Application;
  pixiScreenStore: Readonly<PixiScreenDimensions>;
}>();

export const TickerContext = createContext<Pixi.Ticker>();
