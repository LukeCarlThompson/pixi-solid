import type * as Pixi from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { Texture } from "pixi.js";
import type { JSX } from "solid-js";
import { createSignal, For } from "solid-js";

import { Container, Sprite, Text } from "../components";
import type { PixiComponentProps } from "../components";
import { onTick } from "../on-tick";
import { PixiApplicationProvider } from "../pixi-application";
import { PixiCanvas } from "../pixi-canvas";
import { usePixiScreen } from "../use-pixi-screen";

type FollowTextProps = {
  position: { x: number; y: number };
} & PixiComponentProps;
const FollowText = (props: FollowTextProps): JSX.Element => {
  let spriteRef: Pixi.Sprite | undefined;

  onTick((ticker) => {
    if (!spriteRef) return;

    spriteRef.angle += ticker.deltaTime;
  });
  return (
    <Container position={props.position}>
      <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} style={{ fill: "white" }} />
      <Sprite
        ref={spriteRef}
        anchor={{ x: 0.5, y: 0.5 }}
        texture={Texture.WHITE}
        scale={100}
        tint={"#ff0000"}
      />
      <Sprite ref={spriteRef} texture={Texture.WHITE} scale={100} tint={"#00ff00"}></Sprite>
    </Container>
  );
};

const View = () => {
  const pixiScreen = usePixiScreen();
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [numberOfChildren, setNumberOfChildren] = createSignal(1);

  setInterval(() => {
    setNumberOfChildren((n) => (n % 5) + 1);
  }, 3000);

  const handlePointerMove = (e: FederatedPointerEvent) => {
    setPosition({ x: e.global.x, y: e.global.y });
  };
  return (
    <Container onglobalpointermove={handlePointerMove} eventMode="static">
      <FollowText position={position()} />
      <Text
        text="Centered"
        anchor={0.5}
        position={{ x: pixiScreen.width * 0.5, y: pixiScreen.height * 0.5 }}
        style={{ fill: "white", fontSize: 36 }}
      />
      <For each={Array.from({ length: numberOfChildren() }, (_, i) => i)}>
        {(index) => (
          <Sprite
            anchor={0.5}
            position={{ x: (index + 1) * 50, y: pixiScreen.height - 50 }}
            texture={Texture.WHITE}
            scale={25}
            tint={"#0000ff"}
          />
        )}
      </For>
    </Container>
  );
};

export const App = (): JSX.Element => (
  <PixiApplicationProvider background={"#ebb100"}>
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        "flex-direction": "column",
        overflow: "hidden",
      }}
    >
      <h1 style={{ position: "relative" }}>Pixi-Solid Example</h1>
      <PixiCanvas background="#0a908e">
        <View />
      </PixiCanvas>
    </div>
  </PixiApplicationProvider>
);
