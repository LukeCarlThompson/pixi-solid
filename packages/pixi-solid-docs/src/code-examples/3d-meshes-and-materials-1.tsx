import { Mesh3D, CubeGeometry, Material3D } from "pixi-solid-3d";
import { createSignal } from "solid-js";

export const InteractiveCube = () => {
  const [roughness, setRoughness] = createSignal(0.2);
  const [color, setColor] = createSignal("#38bdf8");

  return (
    <Mesh3D x={0} y={1} z={0} castShadow={true} receiveShadow={true}>
      <CubeGeometry width={1.5} height={1.5} depth={1.5} />
      <Material3D baseColor={color()} roughness={roughness()} metallic={0.1} />
    </Mesh3D>
  );
};
