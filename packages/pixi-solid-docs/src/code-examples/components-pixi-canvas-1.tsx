import { PixiCanvas, Sprite, Container } from "pixi-solid";
import { Texture } from "pixi.js";

export const App = () => (
  <PixiCanvas style={{ width: "100%", height: "100dvh" }} background="#1099bb">
    <Container>
      <Sprite texture={Texture.WHITE} x={100} y={100} scale={50} tint="#ff0000" />
    </Container>
  </PixiCanvas>
);
