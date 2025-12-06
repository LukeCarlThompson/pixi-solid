import { Texture } from "pixi.js";
import { Container, Sprite } from "pixi-solid";

export const MyContainerComponent = () => {
  return (
    <Container x={50} y={50}>
      <Sprite
        texture={Texture.from("path/to/your/image.png")}
        x={100}
        y={150}
        anchor={{ x: 0.5, y: 0.5 }}
      />
    </Container>
  );
};
