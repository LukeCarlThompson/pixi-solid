import { Point, Texture } from "pixi.js";
import { MeshRope } from "pixi-solid";

export const MyMeshRopeComponent = () => {
  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push(new Point(i * 40, Math.sin(i * 0.5) * 30));
  }

  return <MeshRope texture={Texture.from("path/to/rope.png")} points={points} />;
};
