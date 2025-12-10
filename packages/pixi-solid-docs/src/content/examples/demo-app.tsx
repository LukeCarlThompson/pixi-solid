import { PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import type { ParentProps } from "solid-js";

export const DemoApp = (props: ParentProps) => {
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <PixiStage>{props.children}</PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
