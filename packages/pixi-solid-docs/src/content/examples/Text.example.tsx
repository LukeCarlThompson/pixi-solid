import { Text } from "pixi-solid";

export const MyTextComponent = () => {
  return (
    <Text
      text="Hello World"
      x={100}
      y={150}
      style={{
        fill: "white",
        fontSize: 24,
        fontFamily: "Arial",
      }}
    />
  );
};
