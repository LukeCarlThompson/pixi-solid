import { Container, Sprite, Text } from "pixi-solid";
import { onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  createContainerTexture,
  DirectionalLight,
  FlatMaterial,
  Mesh3D,
  OrbitCamera,
  PlaneGeometry,
  View3D,
} from "pixi-solid-3d";
import { Texture } from "pixi.js";
import { createSignal } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  const [uptime, setUptime] = createSignal(0);
  const [calls, setCalls] = createSignal(128);

  // The 2D content is ordinary pixi-solid JSX. Everything inside stays reactive.
  const panel = createContainerTexture(
    <Container>
      <Sprite texture={Texture.WHITE} width={512} height={200} tint={0x0b1220} />
      <Sprite texture={Texture.WHITE} width={512} height={8} y={0} tint={0x38bdf8} />
      <Text
        text="RENDER NODE 04"
        x={28}
        y={34}
        style={{ fontFamily: "monospace", fontSize: 30, fill: "#7dd3fc", letterSpacing: 2 }}
      />
      <Text
        text={`uptime ${uptime().toFixed(1)}s`}
        x={28}
        y={92}
        style={{ fontFamily: "monospace", fontSize: 34, fill: "#e2e8f0" }}
      />
      <Text
        text={`draw calls ${calls()}`}
        x={28}
        y={140}
        style={{ fontFamily: "monospace", fontSize: 26, fill: "#94a3b8" }}
      />
    </Container>,
    { width: 512, height: 200 },
  );

  let elapsed = 0;
  let lastCallTick = 0;

  onTick((ticker) => {
    elapsed += ticker.deltaMS / 1000;
    setUptime(elapsed);

    // Something changing on the 2D side proves the texture is live, not a snapshot.
    if (elapsed - lastCallTick > 0.9) {
      lastCallTick = elapsed;
      setCalls((count) => count + 1);
    }
  });

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#1e293b", groundColor: "#020617", intensity: 0.6 }}
    >
      <Camera3D x={0} y={1.6} z={5} lookAt={{ x: 0, y: 1.3, z: 0 }} />
      <OrbitCamera
        enableDamping={true}
        minDistance={3}
        maxDistance={14}
        target={{ x: 0, y: 1.3, z: 0 }}
      />

      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2} x={3} y={5} z={4} lookAt={{ x: 0, y: 1.3, z: 0 }} />

      {/* The texture is a `Texture`, so any material slot takes it. */}
      <Mesh3D y={1.3} scale={1.4}>
        <PlaneGeometry width={3} height={1.17} />
        <FlatMaterial baseColorTexture={panel} />
      </Mesh3D>
    </View3D>
  );
};
