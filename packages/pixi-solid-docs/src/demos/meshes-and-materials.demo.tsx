import type * as Pixi3D from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  ConeGeometry,
  Container3D,
  CubeGeometry,
  DirectionalLight,
  FlatMaterial,
  Material3D,
  Mesh3D,
  OrbitCamera,
  PhongMaterial,
  SphereGeometry,
  ToonMaterial,
  TorusKnotGeometry,
  View3D,
} from "pixi-solid-3d";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let group: Pixi3D.Container3D | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (group) group.rotation.y = elapsed * 0.45;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="medium"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={3} z={9} lookAt={{ x: 0, y: 0.6, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={5}
        maxDistance={20}
        target={{ x: 0, y: 0.6, z: 0 }}
      />

      <AmbientLight intensity={0.3} />
      <DirectionalLight
        intensity={2.4}
        x={4}
        y={7}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      <Container3D ref={(container) => (group = container)}>
        {/* Metallic-roughness PBR: the default for real-looking surfaces. */}
        <Mesh3D x={-3.3} castShadow={true}>
          <SphereGeometry radius={0.9} />
          <Material3D baseColor={0x38bdf8} roughness={0.2} metallic={0.6} />
        </Mesh3D>

        {/* Phong: cheap specular highlights, familiar from older engines. */}
        <Mesh3D x={-1.1} castShadow={true}>
          <CubeGeometry width={1.4} height={1.4} depth={1.4} />
          <PhongMaterial baseColor={0x22c55e} shininess={60} />
        </Mesh3D>

        {/* Toon: banded shading with an outline, for stylised work. */}
        <Mesh3D x={1.1} castShadow={true}>
          <ConeGeometry radius={0.85} height={1.7} />
          <ToonMaterial baseColor={0xf97316} bands={4} outline={true} />
        </Mesh3D>

        {/* Flat: unlit, so it ignores every light in the scene. */}
        <Mesh3D x={3.3} castShadow={true}>
          <TorusKnotGeometry radius={0.6} tube={0.22} />
          <FlatMaterial baseColor={0xa855f7} />
        </Mesh3D>
      </Container3D>
    </View3D>
  );
};
