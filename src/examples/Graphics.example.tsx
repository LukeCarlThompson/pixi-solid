import { Graphics } from "pixi-solid";

export const MyGraphicsComponent = () => {
  return (
    <Graphics
      ref={(graphics) => {
        graphics.rect(50, 50, 100, 100).fill(0xff0000);
      }}
    />
  );
};
