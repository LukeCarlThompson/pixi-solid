import { View3D, FPSCamera, Camera3D } from "pixi-solid-3d";

export const FirstPersonScene = () => {
  return (
    <View3D width={800} height={600}>
      <Camera3D x={0} y={1.8} z={0} />
      <FPSCamera moveSpeed={8} lookSpeed={0.003} pointerLock={true} keyboard={true} />
    </View3D>
  );
};
