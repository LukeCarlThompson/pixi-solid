import { Texture } from "pixi.js";
import { MeshPlane } from "pixi-solid";

export const MyMeshPlaneComponent = () => {
  return <MeshPlane texture={Texture.from("path/to/your/image.png")} />;
};
