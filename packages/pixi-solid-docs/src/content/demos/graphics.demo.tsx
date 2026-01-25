import { Graphics, PixiApplication, PixiCanvas, PixiStage, usePixiScreen } from "pixi-solid";

const DemoComponent = () => {
  const pixiScreen = usePixiScreen();
  return (
    <>
      <Graphics
        x={pixiScreen.width * 0.5}
        y={pixiScreen.height * 0.5}
        ref={(graphics) => {
          graphics.rect(-50, -50, 100, 100).fill("#ffd500ff");
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
    </>
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
