import { Texture } from "pixi.js";
import { PerspectiveMesh } from "pixi-solid";

export const MyPerspectiveMeshComponent = () => {
  return <PerspectiveMesh texture={Texture.from("path/to/your/image.png")} />;
};
