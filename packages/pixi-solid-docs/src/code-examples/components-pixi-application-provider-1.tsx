import { PixiApplicationProvider, PixiCanvas, usePixiScreen, onTick, Text } from "pixi-solid";
import { createSignal } from "solid-js";

export const App = () => {
  return (
    <PixiApplicationProvider background="#1099bb">
      {/* HTML components here can use pixi-solid hooks */}
      <HtmlComponent />
      <PixiCanvas style={{ width: "100%", height: "500px" }}>
        <CanvasContent />
      </PixiCanvas>
    </PixiApplicationProvider>
  );
};

const HtmlComponent = () => {
  const screen = usePixiScreen();
  return (
    <div style={{ padding: "20px" }}>
      <p>
        Canvas Size: {screen.width}x{screen.height}
      </p>
    </div>
  );
};

const CanvasContent = () => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return (
    <Text text="Hello from Pixi!" style={{ fill: "white", fontSize: 24 }} rotation={rotation()} />
  );
};
