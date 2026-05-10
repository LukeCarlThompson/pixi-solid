import type * as Pixi from "pixi.js";
import { createContext } from "solid-js";

import type { PixiScreenDimensions } from "../use-pixi-screen/pixi-screen-store";

export const PixiAppContext = createContext<Pixi.Application>();

export const TickerContext = createContext<Pixi.Ticker>();

export const ScreenStoreContext = createContext<Readonly<PixiScreenDimensions>>();
