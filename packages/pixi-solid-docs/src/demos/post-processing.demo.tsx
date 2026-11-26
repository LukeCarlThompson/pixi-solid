import { BloomEffect, OutlinePass } from "@pixi/3d/extras";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  SphereGeometry,
  View3D,
} from "pixi-solid-3d";

// Passes are built once and handed to the view. Toggle them with `enabled`, never by
// rebuilding the array, which would rebuild the render graph.
const bloom = new BloomEffect({ intensity: 1.6, threshold: 0.35, radius: 0.7 });
const outline = new OutlinePass({ width: 0.02, color: 0x0ea5e9 });

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#05070d" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let elapsed = 0;
  let ring: { position: { x: number; z: number } } | undefined;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    if (ring) {
      ring.position.x = Math.cos(elapsed * 0.7) * 2.4;
      ring.position.z = Math.sin(elapsed * 0.7) * 2.4;
    }
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      passes={[outline, bloom]}
      environment={{ skyColor: "#0b1220", groundColor: "#020409", intensity: 0.3 }}
    >
      <Camera3D x={0} y={2.5} z={8} lookAt={{ x: 0, y: 0.4, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={5} maxDistance={18} />

      <AmbientLight intensity={0.2} />
      <DirectionalLight intensity={1.6} x={3} y={6} z={4} lookAt={{ x: 0, y: 0, z: 0 }} />

      {/* Emissive above 1 goes past white, which is what bloom picks up. */}
      <Mesh3D x={-1.8} y={0.5}>
        <SphereGeometry radius={0.8} />
        <Material3D baseColor={0x111827} emissive={{ color: 0x38bdf8, strength: 3 }} />
      </Mesh3D>

      <Mesh3D x={1.8} y={0.5}>
        <CubeGeometry width={1.2} height={1.2} depth={1.2} />
        <Material3D baseColor={0x111827} emissive={{ color: 0xf97316, strength: 2.6 }} />
      </Mesh3D>

      <Mesh3D ref={(mesh) => (ring = mesh)} y={0.4}>
        <SphereGeometry radius={0.35} />
        <Material3D baseColor={0x111827} emissive={{ color: 0xf472b6, strength: 4 }} />
      </Mesh3D>
    </View3D>
  );
};
