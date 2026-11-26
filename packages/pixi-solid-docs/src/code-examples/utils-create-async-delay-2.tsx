import { PixiCanvas, Text } from "pixi-solid";
import { createAsyncDelay } from "pixi-solid/utils";
import { createSignal } from "solid-js";

const CancellableDelayComponent = () => {
  const delay = createAsyncDelay();
  const [isWaiting, setIsWaiting] = createSignal(false);
  let abortController: AbortController | undefined;

  const handlePointerDown = async () => {
    setIsWaiting(true);
    abortController = new AbortController();

    console.log("Starting 5 second delay...");
    await delay(5000, abortController.signal);
    setIsWaiting(false);
    console.log("Delay completed!");
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      console.log("Delay cancelled!");
    }
  };

  return (
    <Text
      text={isWaiting() ? "Waiting (click to cancel)..." : "Click me"}
      onpointerdown={isWaiting() ? handleCancel : handlePointerDown}
    />
  );
};
