import type { ApplicationOptions, Container } from "pixi.js";
import {
  Show,
  createContext,
  createEffect,
  createResource,
  onCleanup,
  splitProps,
  useContext,
  type JSX,
  type Ref,
} from "solid-js";

import { Application } from "pixi.js";

const PixiAppContext = createContext<Application>();

export const usePixiApp = () => {
  const app = useContext(PixiAppContext);
  if (!app) {
    throw new Error("usePixiApp must be used within a PixiApplication");
  }
  return app;
};

export type PixiApplicationProps = Partial<Omit<ApplicationOptions, "children" | "resizeTo" | "view">> & {
  ref?: Ref<Container>;
  children?: JSX.Element;
};

export const PixiApplication = (props: PixiApplicationProps) => {
  const [_solidProps, initialisationProps] = splitProps(props, ["ref", "children"]);

  // TODO: Reinitialise the pixi app if any of the initialisationProps change that we can't set at runtime

  const [appResource] = createResource(async () => {
    // Enforce singleton pattern: Check if an app already exists
    // @ts-expect-error
    if (globalThis.__PIXI_DEVTOOLS__) {
      throw new Error("Only one PixiApplication can be active at a time. Multiple instances detected.");
    }

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
        (props.ref as unknown as (arg: any) => void)(app.stage);
      }

      // TODO: Go through the other props that can be set at runtime and apply them here
      // e.g. backgroundColor => app.renderer.backgroundColor, etc.

      app.ticker.autoStart = false;
      app.ticker.start();

      // @ts-expect-error
      globalThis.__PIXI_DEVTOOLS__ = {
        app,
      };

      onCleanup(() => {
        app.destroy(true, { children: true });
        // @ts-expect-error
        globalThis.__PIXI_DEVTOOLS__ = undefined;
      });
    }
  });

  return (
    <Show when={appResource()}>
      {(app) => <PixiAppContext.Provider value={app()}>{props.children}</PixiAppContext.Provider>}
    </Show>
  );
};
