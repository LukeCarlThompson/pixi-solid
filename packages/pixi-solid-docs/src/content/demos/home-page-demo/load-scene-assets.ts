import { Assets, TextureStyle } from "pixi.js";
import groundAssetUrl from "@/assets/ground-tile.png";
import idleAssetUrl_01 from "@/assets/idle_01.png";
import idleAssetUrl_02 from "@/assets/idle_02.png";
import idleAssetUrl_03 from "@/assets/idle_03.png";
import idleAssetUrl_04 from "@/assets/idle_04.png";
import idleAssetUrl_05 from "@/assets/idle_05.png";
import idleAssetUrl_06 from "@/assets/idle_06.png";
import idleAssetUrl_07 from "@/assets/idle_07.png";
import idleAssetUrl_08 from "@/assets/idle_08.png";
import runAssetUrl_01 from "@/assets/run_01.png";
import runAssetUrl_02 from "@/assets/run_02.png";
import runAssetUrl_03 from "@/assets/run_03.png";
import runAssetUrl_04 from "@/assets/run_04.png";
import runAssetUrl_05 from "@/assets/run_05.png";
import runAssetUrl_06 from "@/assets/run_06.png";
import skyAssetUrl from "@/assets/sky.png";

export const loadSceneAssets = async () => {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  try {
    await Assets.load([
      { alias: "sky", src: skyAssetUrl },
      { alias: "ground", src: groundAssetUrl },
      { alias: "run_01", src: runAssetUrl_01 },
      { alias: "run_02", src: runAssetUrl_02 },
      { alias: "run_03", src: runAssetUrl_03 },
      { alias: "run_04", src: runAssetUrl_04 },
      { alias: "run_05", src: runAssetUrl_05 },
      { alias: "run_06", src: runAssetUrl_06 },
      { alias: "idle_01", src: idleAssetUrl_01 },
      { alias: "idle_02", src: idleAssetUrl_02 },
      { alias: "idle_03", src: idleAssetUrl_03 },
      { alias: "idle_04", src: idleAssetUrl_04 },
      { alias: "idle_05", src: idleAssetUrl_05 },
      { alias: "idle_06", src: idleAssetUrl_06 },
      { alias: "idle_07", src: idleAssetUrl_07 },
      { alias: "idle_08", src: idleAssetUrl_08 },
    ]);
    return true;
  } catch {
    return false;
  }
};
