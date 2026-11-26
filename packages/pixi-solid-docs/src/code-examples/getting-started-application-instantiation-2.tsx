import { PixiApplicationProvider, PixiCanvas, usePixiScreen, Text } from "pixi-solid";

export const DemoApp = () => {
  return (
    <PixiApplicationProvider background="#1099bb">
      <HtmlComponent />
      <PixiCanvas style={{ width: "100%", height: "500px" }}>
        <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} />
      </PixiCanvas>
    </PixiApplicationProvider>
  );
};

const HtmlComponent = () => {
  const screen = usePixiScreen();
  return (
    <div style={{ padding: "20px" }}>
      Canvas: {screen.width}x{screen.height}
    </div>
  );
};
