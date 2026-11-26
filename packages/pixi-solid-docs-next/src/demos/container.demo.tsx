import { Container, Graphics, onTick, PixiCanvas, usePixiScreen } from "pixi-solid";
import type * as Pixi from "pixi.js";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  let outer: Pixi.Container | undefined;
  let inner: Pixi.Container | undefined;
  let cumulativeDeltaTime = 0;

  // Rotate the parent container every frame
  onTick((ticker) => {
    if (outer) outer.angle += 1 * ticker.deltaTime;
  });

  // Move the inner container side to side
  onTick((ticker) => {
    if (!inner) return;

    cumulativeDeltaTime += 0.1 * ticker.deltaTime;
    inner.position.x = Math.sin(cumulativeDeltaTime) * 100;
  });

  return (
    <Container
      x={pixiScreen.width * 0.5}
      y={pixiScreen.height * 0.5}
      ref={(container) => (outer = container)}
    >
      <Container ref={(container) => (inner = container)}>
        <Graphics
          ref={(graphics) => {
            // Draw a graphic so we can see the result
            graphics.rect(-50, -50, 100, 100).fill("#ffffff");
          }}
        />
      </Container>
    </Container>
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
    <DemoComponent />
  </PixiCanvas>
);
