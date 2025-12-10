import { PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";
import { Sky } from "./sprite";

export const DemoApp = () => {
  return (
    <PixiApplication background="#1099bb">
      <PixiCanvas>
        <PixiStage>
          <Sky />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
