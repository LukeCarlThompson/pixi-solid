import type { ParticleContainer3D as ParticleContainer3DInstance } from "@pixi/3d";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, OrbitCamera, ParticleContainer3D, View3D } from "pixi-solid-3d";
import { Texture } from "pixi.js";

const COUNT = 1200;

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  let swarm: ParticleContainer3DInstance | undefined;
  let elapsed = 0;

  // A `ParticleContainer3D` has no simulation, so the frame loop drives every slot and uploads
  // once at the end. `setParticleAt` packs each write, so this allocates nothing.
  onTick((ticker) => {
    if (!swarm) return;

    elapsed += ticker.deltaMS / 1000;

    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + elapsed * 0.4;
      const radius = 1.6 + Math.sin(angle * 3 + elapsed) * 0.35;

      swarm.setParticleAt(
        i,
        Math.cos(angle) * radius,
        Math.sin(angle * 4 + elapsed * 1.5) * 0.6 + 1.8,
        Math.sin(angle) * radius,
        0.07,
        angle,
        0x66ccff,
        0.9,
      );
    }

    swarm.upload();
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#050510", groundColor: "#100502", intensity: 0.2 }}
    >
      <Camera3D x={0} y={3.5} z={7} lookAt={{ x: 0, y: 1.8, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={25}
        target={{ x: 0, y: 1.8, z: 0 }}
      />

      <ParticleContainer3D
        ref={(container) => (swarm = container)}
        capacity={COUNT}
        texture={Texture.WHITE}
        blendMode="add"
      />
    </View3D>
  );
};
