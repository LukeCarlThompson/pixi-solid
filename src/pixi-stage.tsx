import type { Container, ContainerOptions } from "pixi.js";
import type { JSX, Ref } from "solid-js";
import { usePixiApp } from "./pixi-application";
import { applyProps } from "./pixi-components";
import type { PixiEventHandlerMap } from "./pixi-events";

export type PixiStageProps = PixiEventHandlerMap &
  Omit<ContainerOptions, "children"> & {
    ref?: Ref<Container>;
    children?: JSX.Element;
  };

/**
 * PixiStage
 *
 * The root container for rendering Pixi display objects. This component
 * uses the application stage (`pixiApp.stage`) as the mount point and
 * applies props and event handlers to it.
 *
 * Props:
 * - `ref` (optional): receives the stage container reference.
 * - Event handler props (e.g. `onpointerdown`) are forwarded to the stage.
 * - Any other container options supported by Pixi may be passed.
 *
 * Children passed to `PixiStage` are inserted into the application stage.
 *
 * **Example**
 * {@includeCode ./examples/PixiStage.example.tsx}
 */
export const PixiStage = (props: PixiStageProps): JSX.Element => {
  const pixiApp = usePixiApp();

  applyProps(pixiApp.stage, props);

  return <>{pixiApp.stage}</>;
};
