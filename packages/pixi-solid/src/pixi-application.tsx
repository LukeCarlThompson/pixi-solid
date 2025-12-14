import type { ApplicationOptions } from "pixi.js";
import { Application } from "pixi.js";
import type { JSX, Ref } from "solid-js";
import { createContext, createEffect, createResource, onCleanup, Show, splitProps, useContext } from "solid-js";

const PixiAppContext = createContext<Application>();

/**
 * A custom SolidJS hook to access the root PIXI.Application instance.
 * This hook must be called from a component that is a descendant of `PixiApplication`.
 *
 * @returns The PIXI.Application instance provided by the `PixiApplication` component.
 * @throws Will throw an error if used outside of a `PixiApplication` context provider.
 */
export const usePixiApp = () => {
  const app = useContext(PixiAppContext);
  if (!app) {
    throw new Error("usePixiApp must be used within a PixiApplication");
  }
  return app;
};

/**
 * Props for the `PixiApplication` component. It extends the PIXI.ApplicationOptions
 * to allow passing configuration directly to the Pixi.js Application constructor,
 * but omits properties that are handled by the component itself.
 */
export type PixiApplicationProps = Partial<Omit<ApplicationOptions, "children" | "resizeTo">> & {
  ref?: Ref<Application>;
  children?: JSX.Element;
};

/**
 * A SolidJS component that creates and manages a PIXI.Application instance.
 * It provides the application instance through context to be used by child components
 * and custom hooks like `usePixiApp`, `useTick`, and `useTicker`.
 *
 * This component should only be used once in your application.
 *
 * @param props The properties to configure the Pixi.js Application.
 *
 */
export const PixiApplication = (props: PixiApplicationProps) => {
  const [_solidProps, initialisationProps] = splitProps(props, ["ref", "children"]);

  // TODO: Split props into initialisation props and runtime props

  const [appResource] = createResource(async () => {
    const app = new Application();
    await app.init({
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      sharedTicker: true,
      ...initialisationProps,
    });

    return app;
  });

  createEffect(() => {
    const app = appResource();
    if (app) {
      if (props.ref) {
        // Solid converts the ref prop to a callback function
        (props.ref as unknown as (arg: any) => void)(app);
      }

      // TODO: Go through the other props that can be set at runtime and apply them here
      // e.g. backgroundColor => app.renderer.backgroundColor, etc.

      app.ticker.autoStart = false;
      app.ticker.start();

      onCleanup(() => {
        app.destroy(true, { children: true });
      });
    }
  });

  return (
    <Show when={appResource()}>
      {(app) => <PixiAppContext.Provider value={app()}>{props.children}</PixiAppContext.Provider>}
    </Show>
  );
};
