import { View3D, OrbitCamera, AmbientLight, DirectionalLight } from "pixi-solid-3d";

export const SceneWithOrbit = () => {
  return (
    <View3D
      width={800}
      height={600}
      ref={(view) => {
        view.camera.position.set(0, 5, 10);
        view.camera.lookAt({ x: 0, y: 0, z: 0 });
      }}
    >
      <OrbitCamera
        enableDamping={true}
        minDistance={2}
        maxDistance={50}
        target={{ x: 0, y: 0, z: 0 }}
      />
      <AmbientLight intensity={0.3} />
      <DirectionalLight intensity={2} x={5} y={10} z={5} castShadow={true} />
    </View3D>
  );
};
