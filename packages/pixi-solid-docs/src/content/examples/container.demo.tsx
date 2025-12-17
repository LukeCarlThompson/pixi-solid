import { Container, Graphics, onResize, onTick, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";

// Nested containers example
export const DemoApp = () => {
  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <Container
            ref={(container) => {
              // Position outer container in the center of the screen on resize
              onResize((screen) => {
                container.position.x = screen.width * 0.5;
                container.position.y = screen.height * 0.5;
              });
              // Rotate it every frame
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
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
