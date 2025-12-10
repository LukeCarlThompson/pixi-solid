import { PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { RunningMan } from "./animated-sprite";
import { Sky } from "./sprite";

export const DemoApp = () => {
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <PixiStage>
          <Sky />
          <RunningMan />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
