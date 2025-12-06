import { HTMLText } from "pixi-solid";

export const MyHTMLTextComponent = () => {
  return (
    <HTMLText
      text={'<p style="color:white; font-size: 24px;">Hello <b>World</b></p>'}
      x={100}
      y={150}
    />
  );
};
