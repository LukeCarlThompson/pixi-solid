import { PixiCanvas, Text } from "pixi-solid";

const DemoComponent = () => {
  return (
    <Text
      text="Hello World"
      style={{
        fill: "white",
        fontSize: 68,
        fontFamily: "Arial",
      }}
    />
  );
};

export const Demo = () => (
  <PixiCanvas style={{ "aspect-ratio": "2/1.5" }} background="#1099bb">
    <DemoComponent />
  </PixiCanvas>
);
