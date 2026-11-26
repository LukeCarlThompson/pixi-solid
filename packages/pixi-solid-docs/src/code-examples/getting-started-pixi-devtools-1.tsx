import { PixiCanvas, getPixiApp, Container } from "pixi-solid";
import { onCleanup } from "solid-js";

const DemoComponent = () => {
  // We have access to the Pixi Application instance using the `getPixiApp` function.
  const pixiApp = getPixiApp();
  // @ts-ignore — __PIXI_DEVTOOLS__ is not in the type definitions
  globalThis.__PIXI_DEVTOOLS__ = {
    app: pixiApp,
  };
  onCleanup(() => {
    // @ts-ignore — __PIXI_DEVTOOLS__ is not in the type definitions
    globalThis.__PIXI_DEVTOOLS__ = undefined;
  });

  return <Container>{/* Your pixi-solid content goes here */}</Container>;
};

/**
 * The DemoApp component sets up the Pixi Application
 * and can be mounted anywhere in your SolidJS app.
 * It will render a Canvas element with a Pixi Stage inside it.
 */
export const DemoApp = () => {
  return (
    <PixiCanvas>
      <DemoComponent />
    </PixiCanvas>
  );
};
