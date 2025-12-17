import { Graphics, onResize, PixiApplication, PixiCanvas, PixiStage } from "pixi-solid";

export const DemoApp = () => {
  return (
    <PixiApplication>
      <PixiCanvas style={{ "aspect-ratio": "2/1.5" }}>
        <PixiStage>
          <Graphics
            ref={(graphics) => {
              graphics.rect(-50, -50, 100, 100).fill("#ffd500ff");

              // Position the graphics in the center of the screen on resize
              onResize((screen) => {
                graphics.position.x = screen.width * 0.5;
                graphics.position.y = screen.height * 0.5;
              });
            }}
          />
          <Graphics
            ref={(graphics) => {
              graphics.rect(50, 50, 100, 200).fill(0xff0000).circle(200, 200, 50).stroke(0x00ff00);
            }}
          />
          <Graphics
            ref={(graphics) => {
              graphics.svg(`<svg>
                              <path d="M 100 300 q 150 200 300 100" stroke="blue" stroke-width="5" fill="pink" />
                            </svg>`);
            }}
          />
        </PixiStage>
      </PixiCanvas>
    </PixiApplication>
  );
};
