import { PixiCanvas, usePixiScreen } from "pixi-solid";
import {
  AmbientLight,
  Camera3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  OrbitCamera,
  View3D,
} from "pixi-solid-3d";
import { For, createSignal } from "solid-js";

const CUBES = [
  { id: 0, x: -2.2 },
  { id: 1, x: 0 },
  { id: 2, x: 2.2 },
];

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#09090b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();
  const [hovered, setHovered] = createSignal<number | null>(null);
  const [selected, setSelected] = createSignal<number | null>(null);

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#101828", groundColor: "#020617", intensity: 0.4 }}
    >
      <Camera3D x={0} y={3} z={7} lookAt={{ x: 0, y: 0, z: 0 }} />
      <OrbitCamera enableDamping={true} minDistance={4} maxDistance={20} />

      <AmbientLight intensity={0.4} />
      <DirectionalLight intensity={2.2} x={4} y={6} z={4} />

      <For each={CUBES}>
        {(cube) => (
          <Mesh3D
            label={`cube-${cube.id}`}
            x={cube.x}
            scale={hovered() === cube.id ? 1.15 : 1}
            eventMode="static"
            hitVolume="geometry"
            cursor={hovered() === cube.id ? "pointer" : "default"}
            onpointerenter={() => setHovered(cube.id)}
            onpointerleave={() => setHovered((current) => (current === cube.id ? null : current))}
            onclick={() => setSelected((current) => (current === cube.id ? null : cube.id))}
          >
            <CubeGeometry width={1.4} height={1.4} depth={1.4} />
            <Material3D
              baseColor={selected() === cube.id ? 0xf97316 : 0x38bdf8}
              roughness={0.35}
              metallic={0.1}
            />
          </Mesh3D>
        )}
      </For>
    </View3D>
  );
};
