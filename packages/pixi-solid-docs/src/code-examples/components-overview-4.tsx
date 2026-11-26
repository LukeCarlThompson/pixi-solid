import { Container, onTick } from "pixi-solid";
import type * as Pixi from "pixi.js";

export const ExampleComponent = () => {
  // Get a ref to the Container
  let containerRef: Pixi.Container | undefined;

  onTick((ticker) => {
    if (!containerRef) return;
    containerRef.rotation += ticker.deltaTime;
  });

  return <Container ref={containerRef}>{/* ...any children */}</Container>;
};
