import { Texture } from "pixi.js";
import { MeshSimple } from "pixi-solid";

export const MyMeshSimpleComponent = () => {
  const vertices = new Float32Array([-100, -100, 100, -100, 100, 100, -100, 100]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

  return (
    <MeshSimple
      texture={Texture.from("path/to/your/image.png")}
      vertices={vertices}
      uvs={uvs}
      indices={indices}
    />
  );
};
