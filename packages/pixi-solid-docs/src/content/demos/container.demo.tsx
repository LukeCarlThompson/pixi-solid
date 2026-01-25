import { Container, Graphics, onTick, PixiApplication, PixiCanvas, PixiStage, usePixiScreen } from "pixi-solid";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();

  return (
    <Container
      x={pixiScreen.width * 0.5}
      y={pixiScreen.height * 0.5}
      ref={(container) => {
        // Rotate the parent container every frame
        onTick((ticker) => {
          container.angle += 1 * ticker.deltaTime;
        });
      }}
    >
      <Container
        ref={(container) => {
          // Move the inner container side to side
          let cumulativeDeltaTime = 0;
          onTick((ticker) => {
            cumulativeDeltaTime += 0.1 * ticker.deltaTime;
            container.position.x = Math.sin(cumulativeDeltaTime) * 100;
          });
        }}
      >
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
  <PixiApplication>
    <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
      <PixiStage>
        <DemoComponent />
      </PixiStage>
    </PixiCanvas>
  </PixiApplication>
);
