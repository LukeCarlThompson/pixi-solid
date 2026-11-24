import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  SpotLight,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let elapsed = 0;
  let cube: { rotation: { y: number } } | undefined;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (cube) cube.rotation.y = elapsed * 0.6;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="high"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.5 }}
    >
      <Camera3D x={0} y={4} z={9} lookAt={{ x: 0, y: 1, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={5}
        maxDistance={22}
        target={{ x: 0, y: 1, z: 0 }}
      />

      {/* Fills the shadows so nothing goes fully black. */}
      <AmbientLight intensity={0.25} />

      {/* The key light. It faces its local -Z, so aim it at what it should light. */}
      <DirectionalLight
        intensity={2.6}
        color={0xfff2dc}
        x={5}
        y={8}
        z={4}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      {/* A warm bounce from the left. */}
      <PointLight intensity={6} color={0xff8a3d} x={-4} y={2} z={-2} />

      {/* A hard pool of light from above the stage. */}
      <SpotLight
        intensity={9}
        color={0x7dd3fc}
        x={0}
        y={7}
        z={0}
        lookAt={{ x: 0, y: 0, z: 0 }}
        coneAngle={0.55}
        penumbra={0.4}
      />

      {/* A floor. `PlaneGeometry` lies in XY, so a quarter turn puts it under our feet. */}
      <Mesh3D rotationX={-Math.PI / 2} receiveShadow={true}>
        <PlaneGeometry width={24} height={24} />
        <Material3D baseColor={0x1e293b} roughness={0.9} />
      </Mesh3D>

      <Mesh3D y={1} castShadow={true}>
        <SphereGeometry radius={1} />
        <Material3D baseColor={0x38bdf8} roughness={0.25} metallic={0.4} />
      </Mesh3D>

      <Mesh3D ref={(mesh) => (cube = mesh)} x={2.6} y={0.8} castShadow={true}>
        <CubeGeometry width={1.6} height={1.6} depth={1.6} />
        <Material3D baseColor={0xf97316} roughness={0.4} />
      </Mesh3D>
    </View3D>
  );
};
