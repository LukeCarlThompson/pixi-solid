import type { Container, ContainerOptions } from "pixi.js";
import type { JSX, Ref } from "solid-js";

import type { PixiEventHandlerMap } from "./pixi-events";
import { applyProps } from "./pixi-components";
import { createRenderEffect } from "solid-js";
import { insert } from "./renderer";
import { usePixiApp } from "./pixi-application";

export type PixiStageProps = PixiEventHandlerMap &
  Omit<ContainerOptions, "children"> & {
    ref?: Ref<Container>;
    children?: JSX.Element;
  };

export const PixiStage = (props: PixiStageProps): JSX.Element => {
  const pixiApp = usePixiApp();

  applyProps(pixiApp.stage, props);

  createRenderEffect(() => {
    insert(pixiApp.stage, () => props.children);
  });

  return <>{pixiApp.stage}</>;
};
