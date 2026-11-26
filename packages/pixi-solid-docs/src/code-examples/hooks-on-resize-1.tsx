import { onResize, PixiCanvas, Text } from "pixi-solid";
import type * as Pixi from "pixi.js";
import { createSignal } from "solid-js";

const MyResponsiveComponent = () => {
  const [rendererWidth, setRendererWidth] = createSignal(0);
  const [rendererHeight, setRendererHeight] = createSignal(0);

  onResize((screen: Pixi.Rectangle) => {
    setRendererWidth(screen.width);
    setRendererHeight(screen.height);
    console.log("Renderer resized to:", screen.width, "x", screen.height);
  });

  return (
    // You can use the signals to dynamically adjust your PixiJS components
    <Text
      text={`Renderer Dimensions: ${rendererWidth()}x${rendererHeight()}`}
      position={{ x: rendererWidth() * 0.5, y: rendererHeight() * 0.5 }}
      style={{
        fill: "#ffffff",
        fontSize: 24,
      }}
    />
  );
};

export const DemoApp = () => {
  return (
    <PixiCanvas background="#1099bb">
      <MyResponsiveComponent />
    </PixiCanvas>
  );
};
