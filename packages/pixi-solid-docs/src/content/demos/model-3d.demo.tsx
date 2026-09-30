import { Material3D, type Scene3DSource } from "@pixi/3d";
import { PixiCanvas, usePixiScreen } from "pixi-solid";
import { Camera3D, Model3D, SpotLight, View3D, Sprite3D } from "pixi-solid-3d";
import { useSmoothDamp } from "pixi-solid/utils";
import type { FederatedPointerEvent } from "pixi.js";
import { Assets } from "pixi.js";
import { createResource, createSignal, Show } from "solid-js";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#18181b" }}>
    <DemoContent />
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();

  const [knightSource] = createResource<Scene3DSource>(async () => {
    return await Assets.load<Scene3DSource>("/pixi-solid/3d-models/Knight.glb");
  });

  const [targetAngle, setTargetAngle] = createSignal(0);
  let isDragging = false;
  let lastPointerX = 0;

  const smoothAngle = useSmoothDamp({
    to: () => targetAngle(),
    smoothTimeMs: () => 140,
  });

  const handlePointerDown = (e: FederatedPointerEvent) => {
    isDragging = true;
    lastPointerX = e.global.x;
  };

  const handlePointerMove = (e: FederatedPointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.global.x - lastPointerX;
    lastPointerX = e.global.x;

    // Rotate character by the horizontal drag delta (0.5 degrees per pixel)
    setTargetAngle((prev) => prev + deltaX * 0.5);
  };

  const handlePointerUp = () => {
    isDragging = false;
  };

  return (
    <View3D
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: "#fff1b9", groundColor: "#2c3679", intensity: 0.05 }}
    >
      <Sprite3D
        eventMode="static"
        cursor="grab"
        onpointerdown={handlePointerDown}
        onglobalpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointerupoutside={handlePointerUp}
        material={new Material3D()}
        castShadow={false}
        billboardMode={"spherical"}
        z={pixiScreen.height * -0.5}
        alphaMode="mask"
        width={pixiScreen.width}
        height={pixiScreen.height}
      />
      <Sprite3D
        eventMode="static"
        cursor="grab"
        onpointerdown={handlePointerDown}
        onglobalpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointerupoutside={handlePointerUp}
        material={new Material3D()}
        castShadow={false}
        billboardMode={"none"}
        y={0}
        angleX={-90}
        alphaMode="mask"
        width={pixiScreen.width}
        height={pixiScreen.height}
      />
      <Camera3D x={0} y={2} z={4.5} lookAt={{ x: 0, y: 1.5, z: 0 }} />
      <SpotLight
        intensity={100}
        color={"#b7f1ff"}
        x={4}
        y={3}
        z={3}
        castShadow={true}
        lookAt={{ x: 0, y: 1.8, z: 0 }}
        coneAngle={10}
        penumbra={1}
      />
      <SpotLight
        intensity={1000}
        color={"#ff4f4c"}
        x={-10}
        y={14}
        z={-9}
        castShadow={true}
        lookAt={{ x: 0, y: 1.5, z: 0 }}
        coneAngle={20}
        penumbra={1}
      />
      <SpotLight
        intensity={500}
        color={"#ffa04c"}
        x={14}
        y={14}
        z={-9}
        castShadow={true}
        lookAt={{ x: 0, y: 1.5, z: 0 }}
        coneAngle={60}
        penumbra={1}
      />
      <Show when={knightSource()}>
        {(source) => (
          <Model3D
            source={source()}
            castShadow={true}
            receiveShadow={true}
            angleY={smoothAngle.value()}
          />
        )}
      </Show>
    </View3D>
  );
};

export default Demo;
