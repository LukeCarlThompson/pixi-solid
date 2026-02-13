import type * as Pixi from "pixi.js";
import type { JSX, ParentProps } from "solid-js";
import { createResource, onCleanup, Show, splitProps, useContext } from "solid-js";

import { createPixiScreenStore } from "../use-pixi-screen/pixi-screen-store";

import { PixiAppContext, TickerContext } from "./context";
import { createPixiApplication } from "./pixi-application";

/**
 * Props for the `PixiApplication` component. It extends the PIXI.ApplicationOptions
 * minus the `children` and `resizeTo` properties, which are handled by pixi-solid internally.
 * There is also an optional `existingApp` property to pass in an already created Pixi.Application instance, which will be used instead of creating a new one.
 */
export type PixiApplicationProps = Partial<
  Omit<Pixi.ApplicationOptions, "children" | "resizeTo">
> & {
  children?: JSX.Element;
  existingApp?: Pixi.Application;
};

/**
 * A SolidJS component that creates a Pixi.Application instance and works as a context provider.
 * It provides the application instance through context to be used by child components
 * and custom hooks like `getPixiApp`, `onTick`, `getTicker` and `usePixiScreen`.
 *
 * This component should only be used once in your application.
 *
 * @param props The properties to configure the Pixi.js Application.
 *
 */
export const PixiApplicationProvider = (props: PixiApplicationProps) => {
  const [appResource] = createResource(async () => {
    const existingContext = useContext(PixiAppContext);
    if (existingContext?.app) {
      return existingContext.app;
    }
    const [, initialisationProps] = splitProps(props, ["children", "existingApp"]);
    return await createPixiApplication(initialisationProps);
  });

  onCleanup(() => {
    appResource()?.destroy(true, { children: true });
  });

  return (
    <Show when={appResource()}>
      {(app) => {
        const pixiScreenStore = createPixiScreenStore(app().renderer);
        const contextValue = {
          app: app(),
          pixiScreenStore,
        };

        return (
          <PixiAppContext.Provider value={contextValue}>
            <TickerContext.Provider value={app().ticker}>{props.children}</TickerContext.Provider>
          </PixiAppContext.Provider>
        );
      }}
    </Show>
  );
};

export type TickerProviderProps = ParentProps<{ ticker: Pixi.Ticker }>;

/**
 * This is only required if you want a ticker without the Pixi Application, usually for testing a store that relies on the ticker related utilities.
 * It provides context for the `onTick`, `delay`, `createAsyncDelay` and `getTicker` utilities.
 *
 * The ticker instance you want to use needs to be passed in as a prop so it can be manually controlled from the outside for testing.
 */
export const TickerProvider = (props: TickerProviderProps) => {
  return <TickerContext.Provider value={props.ticker}>{props.children}</TickerContext.Provider>;
};
