import type { JSX } from "@solidjs/web";
import type * as Pixi from "pixi.js";
import type { ParentProps } from "solid-js";
import { createMemo, DEV, omit, onCleanup, Show, untrack, useContext } from "solid-js";

import { createPixiScreenStore } from "../use-pixi-screen/pixi-screen-store";

import { PixiAppContext, ScreenStoreContext, TickerContext } from "./context";
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
 */
export const PixiApplicationProvider = (props: PixiApplicationProps): JSX.Element =>
  // `createComponent` runs the body with a strict-read label, which warns on any
  // reactive read here. The body is entirely one-time setup, so run it under
  // `untrack`; the effects and memos created inside keep their own tracking.
  untrack(() => {
    const externallyProvidedApp = props.existingApp;
    let ownedApp: Pixi.Application | undefined;
    let ownedAppInitialized = false;
    let ownerDisposed = false;

    const warnAboutIgnoredOptions = () => {
      if (!DEV) return;

      const hasOptions = Object.keys(props).some(
        (key) =>
          key !== "children" &&
          key !== "existingApp" &&
          props[key as keyof PixiApplicationProps] !== undefined,
      );

      if (hasOptions) {
        console.warn(
          "[pixi-solid] Application options were provided but ignored because an app already exists in context. Pass them to the provider that creates the app.",
        );
      }
    };

    const destroyOwnedApp = () => {
      const app = ownedApp;
      ownedApp = undefined;
      if (app) app.destroy(true, { children: true });
    };

    const ApplicationContents = (contentProps: { app: Pixi.Application }): JSX.Element => {
      const pixiScreenStore = createPixiScreenStore(contentProps.app.renderer);

      return (
        <PixiAppContext value={contentProps.app}>
          <ScreenStoreContext value={pixiScreenStore}>
            <TickerContext value={contentProps.app.ticker}>{props.children}</TickerContext>
          </ScreenStoreContext>
        </PixiAppContext>
      );
    };

    let existingContext: Pixi.Application | undefined;
    try {
      existingContext = useContext(PixiAppContext);
    } catch {
      // No enclosing provider; a new application will be created below.
    }
    const existingApp = externallyProvidedApp ?? existingContext;

    if (existingApp) {
      warnAboutIgnoredOptions();
      return <ApplicationContents app={existingApp} />;
    }

    const initialisationProps = { ...omit(props, "children", "existingApp") };
    const app = createMemo<Pixi.Application | undefined>(
      async (): Promise<Pixi.Application> => {
        try {
          const createdApp = await createPixiApplication(initialisationProps, (created) => {
            ownedApp = created;
          });
          ownedAppInitialized = true;

          if (ownerDisposed) destroyOwnedApp();

          return createdApp;
        } catch (error) {
          // createPixiApplication destroys instances whose initialization fails.
          ownedApp = undefined;
          throw error;
        }
      },
      { loadingValue: undefined },
    );

    onCleanup(() => {
      ownerDisposed = true;
      if (ownedAppInitialized) destroyOwnedApp();
    });

    return (
      <Show when={app()} keyed>
        {(resolvedApp) => <ApplicationContents app={resolvedApp} />}
      </Show>
    );
  });

export type TickerProviderProps = ParentProps<{ ticker: Pixi.Ticker }>;

/**
 * This is only required if you want a ticker without the Pixi Application.
 * For applications that want to use multiple tickers or for testing a store that relies on the ticker related utilities.
 * It provides context for the `onTick`, `createDelay`, `createAsyncDelay` and `getTicker` utilities.
 *
 * The ticker instance you want to use needs to be passed in as a prop so it can be manually controlled from the outside for testing.
 */
export const TickerProvider = (props: TickerProviderProps): JSX.Element => {
  return <TickerContext value={props.ticker}>{props.children}</TickerContext>;
};
