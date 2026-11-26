import { Text } from "pixi-solid";
import { createDelay } from "pixi-solid/utils";

const DelayedCallbackComponent = () => {
  const delay = createDelay();

  const handlePointerDown = () => {
    console.log("Pointer down");
    delay(1000, () => {
      console.log("1 second has passed on the ticker");

      delay(500, () => {
        console.log("Nested delay complete");
      });
    });
  };

  return <Text text="Click me" onpointerdown={handlePointerDown} />;
};
