import type * as Pixi3D from "@pixi/3d";
import { CubeGeometry, Material3D, Matrix4, RenderPassBit } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  BatchedMesh3D,
  Camera3D,
  DirectionalLight,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";

const COLUMNS = 40;
const ROWS = 40;
const COUNT = COLUMNS * ROWS;

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const fillBatch = (batch: Pixi3D.BatchedMesh3D) => {
  const geometry = new CubeGeometry({ width: 0.35, height: 0.35, depth: 0.35 });
  const material = new Material3D({ baseColor: 0x38bdf8, roughness: 0.4 });
  const matrix = new Matrix4();

  for (let i = 0; i < COUNT; i++) {
    const column = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);

    // One matrix reused: `setMatrixAt` copies the values into the batch.
    matrix.identity().setPosition({
      x: (column - COLUMNS / 2) * 0.5,
      y: 0,
      z: (row - ROWS / 2) * 0.5,
    });

    batch.setGeometryAt(i, geometry);
    batch.setMaterialAt(i, material);
    batch.setMatrixAt(i, matrix);
    batch.setPassesAt(i, RenderPassBit.OPAQUE | RenderPassBit.SHADOW);
  }
};

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let batch: Pixi3D.BatchedMesh3D | undefined;
  let elapsed = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    // Moving the whole batch is one node update, not one per instance.
    if (batch) batch.rotation.y = elapsed * 0.15;
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      shadowQuality="medium"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={6} z={12} lookAt={{ x: 0, y: 0, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={6} maxDistance={40} />

      <AmbientLight intensity={0.35} />
      <DirectionalLight
        intensity={2.2}
        x={5}
        y={8}
        z={5}
        lookAt={{ x: 0, y: 0, z: 0 }}
        castShadow={true}
      />

      <BatchedMesh3D
        label="grid"
        size={COUNT}
        ref={(created) => {
          batch = created;
          fillBatch(created);
        }}
      />
    </View3D>
  );
};
