import type * as Pixi from "pixi.js";
import type { FederatedPointerEvent } from "pixi.js";
import { Texture } from "pixi.js";
import type { JSX } from "solid-js";
import { createSignal } from "solid-js";
import type { PixiComponentProps } from "../component-creation";
import { getPixiApp, onTick, PixiApplication } from "../pixi-application";
import { PixiCanvas } from "../pixi-canvas";
import { Container, Sprite, Text } from "../pixi-components";

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
    <Container
      position={props.position}
      eventMode="static"
      onmousedown={(e) => {
        console.log(e);
      }}
    >
      <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} style={{ fill: "white" }} />
      <Sprite ref={spriteRef} anchor={{ x: 0.5, y: 0.5 }} texture={Texture.WHITE} scale={100} tint={"#ff0000"} />
      <Sprite ref={spriteRef} texture={Texture.WHITE} scale={100} tint={"#00ff00"}></Sprite>
    </Container>
  );
};

const CenteredText = (props: { text: string }): JSX.Element => {
  let textRef: Pixi.Text | undefined;
  const app = getPixiApp();

  onTick(() => {
    if (!textRef || !textRef.parent) return;

    textRef.position.set(app.renderer.width / 2, app.renderer.height / 2);
  });
  return (
    <Text
      ref={textRef}
      text={props.text}
      anchor={{ x: 0.5, y: 0.5 }}
      position={{ x: 400, y: 300 }}
      style={{ fill: "white", fontSize: 36 }}
    />
  );
};

export const App = (): JSX.Element => {
  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  const handlePointerMove = (e: FederatedPointerEvent) => {
    setPosition({ x: e.global.x, y: e.global.y });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        "flex-direction": "column",
        overflow: "hidden",
      }}
    >
      <h1 style={{ position: "relative" }}>Pixi.js SolidJS Example</h1>
      <PixiApplication background={"#1099bb"}>
        <PixiCanvas>
          <FollowText position={position()} onglobalpointermove={handlePointerMove} eventMode="static" />
          <CenteredText text="Centered" />
        </PixiCanvas>
      </PixiApplication>
    </div>
  );
};
