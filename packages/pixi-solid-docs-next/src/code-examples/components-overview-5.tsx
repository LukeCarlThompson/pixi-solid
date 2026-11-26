import { Container, onTick } from "pixi-solid";
import type * as Pixi from "pixi.js";

export const ExampleComponent = () => {
  return (
    <Container
      ref={(instance) => {
        onTick((ticker) => {
          instance.rotation += ticker.deltaTime;
        });
      }}
    >
      {/* ...children */}
    </Container>
  );
};
