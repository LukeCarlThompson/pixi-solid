import { BitmapFont } from "pixi.js";
import { BitmapText } from "pixi-solid";

// Assume a bitmap font is loaded, e.g., using Assets.load
// BitmapFont.from("my-font-name", { fill: "#ffffff", fontSize: 32 });

export const MyBitmapTextComponent = () => {
  return (
    <BitmapText
      text="Hello World"
      style={{ fontFamily: "my-font-name", fontSize: 32, fill: "#ffcc00" }}
      x={100}
      y={150}
      anchor={{ x: 0.5, y: 0.5 }}
    />
  );
};
