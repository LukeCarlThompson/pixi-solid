import { Container, Graphics, onTick, PixiCanvas, Text, usePixiScreen } from "pixi-solid";
import {
  Camera3D,
  Container3D,
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  useWorldToScreen,
  View3D,
  View3DProvider,
} from "pixi-solid-3d";
import { TextStyle } from "pixi.js";
import { Show } from "solid-js";
import { createStore } from "solid-js/store";

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5", "background-color": "#121214" }}>
    <View3DProvider>
      <DemoContent />
    </View3DProvider>
  </PixiCanvas>
);

const DemoContent = () => {
  const pixiScreen = usePixiScreen();
  let cubeRef: any;

  // Seamlessly resolves the View3D from the parent <View3DProvider>!
  const screenPos = useWorldToScreen(() => cubeRef);

  const [cubePosition, setCubePosition] = createStore({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  let time = 0;
  onTick((ticker) => {
    time += 0.02 * ticker.deltaTime;
    const x = Math.sin(time) * 2;
    setCubePosition("position", { x });
    setCubePosition("rotation", {
      x: cubePosition.rotation.x + 0.005 * ticker.deltaTime,
      y: cubePosition.rotation.y + 0.01 * ticker.deltaTime,
    });
  });

  return (
    <>
      <View3D
        width={pixiScreen.width}
        height={pixiScreen.height}
        toneMapping="aces"
        environment={{ skyColor: 0x88ccff, groundColor: 0x553311 }}
      >
        <Camera3D x={0} y={3} z={6} lookAt={{ x: 0, y: 0, z: 0 }} />

        <DirectionalLight
          intensity={2.5}
          color={0xffffff}
          x={5}
          y={8}
          z={5}
          lookAt={{ x: 0, y: 0, z: 0 }}
        />

        <Container3D
          ref={(cube) => {
            cubeRef = cube;
            let time = 0;
            onTick((ticker) => {
              time += 0.02 * ticker.deltaTime;
              const x = Math.sin(time) * 2;
              setCubePosition("position", { x });
              cube.x = x;
              cube.rotation.y += 0.01 * ticker.deltaTime;
              cube.rotation.x += 0.005 * ticker.deltaTime;
            });
          }}
        >
          <Mesh3D>
            <CubeGeometry width={1.5} height={1.5} depth={1.5} />
            <Material3D baseColor={0x38bdf8} roughness={0.2} />
          </Mesh3D>
        </Container3D>
      </View3D>

      {/* Sibling 2D Overlay HUD inside View3DProvider */}
      <Show when={screenPos().visible}>
        <Container x={screenPos().x} y={screenPos().y - 60}>
          <Graphics
            ref={(g) => {
              g.roundRect(-50, -16, 100, 32, 8).fill({ color: 0x000000, alpha: 0.7 });
            }}
          />
          <Text
            text="3D Cube"
            anchor={0.5}
            style={
              new TextStyle({
                fill: "#ffffff",
                fontSize: 14,
                fontWeight: "bold",
              })
            }
          />
        </Container>
      </Show>
    </>
  );
};

export default Demo;
