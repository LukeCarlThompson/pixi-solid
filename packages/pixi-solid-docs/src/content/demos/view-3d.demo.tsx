import { CubeGeometry, Material3D } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  Container3D,
  DirectionalLight,
  Mesh3D,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#111" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  const geometry = new CubeGeometry({ width: 2, height: 2, depth: 2 });
  const material = new Material3D({
    baseColor: 0x4f88ea,
    roughness: 0.3,
    metallic: 0.2,
  });

  return (
    <View3D width={pixiScreen.width} height={pixiScreen.height} toneMapping="aces">
      <Camera3D x={0} y={3} z={5} />
      <OrbitCamera enableDamping={true} minDistance={2} maxDistance={20} />
      <AmbientLight intensity={0.4} />
      <DirectionalLight
        intensity={2.5}
        color={0xffffff}
        x={5}
        y={8}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
      />
      <Container3D
        ref={(cubeContainer) => {
          onTick((ticker) => {
            cubeContainer.rotation.y += 0.01 * ticker.deltaTime;
            cubeContainer.rotation.x += 0.005 * ticker.deltaTime;
          });
        }}
      >
        <Mesh3D geometry={geometry} material={material} castShadow={true} receiveShadow={true} />
      </Container3D>
    </View3D>
  );
};
