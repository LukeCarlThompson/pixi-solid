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
    <Scene />
  </PixiCanvas>
);

/**
 * The provider owns the View3D, so the viewport configuration lives here rather than on the
 * <View3D> that mounts it into the 2D scene graph.
 */
const Scene = () => {
  const pixiScreen = usePixiScreen();

  return (
    <View3DProvider
      width={pixiScreen.width}
      height={pixiScreen.height}
      toneMapping="aces"
      environment={{ skyColor: 0x88ccff, groundColor: 0x553311 }}
    >
      <SceneContent />
    </View3DProvider>
  );
};

const SceneContent = () => {
  // The cube's transform is the source of truth. Nothing is mutated imperatively: the 3D node
  // renders from this state, and the 2D overlay projects the very same position.
  const [cube, setCube] = createStore({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  // Phase for the oscillating `x`, kept out of the state we render from.
  let elapsed = 0;
  onTick((ticker) => {
    elapsed += 0.02 * ticker.deltaTime;
    setCube("position", { x: Math.sin(elapsed) * 2, y: 0, z: 0 });
    setCube("rotation", "x", (x) => x + 0.005 * ticker.deltaTime);
    setCube("rotation", "y", (y) => y + 0.01 * ticker.deltaTime);
  });

  // No refs or imperative reads: the overlay reads the same store the 3D node renders from.
  const screenPos = useWorldToScreen(() => cube.position);

  return (
    <>
      <View3D>
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
          x={cube.position.x}
          y={cube.position.y}
          z={cube.position.z}
          rotationX={cube.rotation.x}
          rotationY={cube.rotation.y}
          rotationZ={cube.rotation.z}
        >
          <Mesh3D>
            <CubeGeometry width={1.5} height={1.5} depth={1.5} />
            <Material3D baseColor={0x38bdf8} roughness={0.2} />
          </Mesh3D>
        </Container3D>
      </View3D>

      {/* Sibling 2D overlay — same provider, so it resolves the same View3D */}
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
