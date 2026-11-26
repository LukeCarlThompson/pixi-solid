import { PixiCanvas, Text } from "pixi-solid";
import { createAsyncDelay } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const DelayedActionComponent = () => {
  // Call this in a synchronous scope inside `PixiApplicationProvider`, `PixiCanvas`, or `TickerProvider`.
  const delay = createAsyncDelay();
  const [isWaiting, setIsWaiting] = createSignal(false);

  const handlePointerDown = async () => {
    setIsWaiting(true);
    console.log("Pointer down, waiting 2 seconds...");
    await delay(2000);
    setIsWaiting(false);
    console.log("2 seconds have passed on the ticker");
  };

  return <Text text={isWaiting() ? "Waiting..." : "Click me"} onpointerdown={handlePointerDown} />;
};
