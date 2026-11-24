import { ConeShape } from "@pixi/3d/extras";
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, OrbitCamera, ParticleSystem3D, View3D } from "pixi-solid-3d";
import { createSignal } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();
  const [rate] = createSignal(120);

  // Cone emitter spraying glowing embers upward in +Y direction
  const fireCone = new ConeShape({ angle: 22, radius: 0.3 });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#050510", groundColor: "#100502", intensity: 0.2 }}
    >
      <Camera3D x={0} y={3} z={7} lookAt={{ x: 0, y: 1.5, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={25}
        target={{ x: 0, y: 1.5, z: 0 }}
      />

      {/* 3D GPU Particle Fountain */}
      <ParticleSystem3D
        y={0}
        capacity={1500}
        emitRate={rate()}
        shape={fireCone}
        speed={[2.5, 5]}
        life={[1.2, 2.2]}
        size={[0.2, 0.4]}
        sizeEnd={[0.02, 0.08]}
        color={0xff7700}
        colorEnd={0xff1100}
        alpha={[0.9, 1]}
        alphaEnd={0}
        gravity={-1.5}
        drag={0.3}
        blendMode="add"
      />
    </View3D>
  );
};

export default Demo;
