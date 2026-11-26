import { PixiCanvas, Container, TickerProvider, onTick } from "pixi-solid";
import { Sprite } from "pixi-solid";
import { Texture, Ticker } from "pixi.js";
import { createSignal, onCleanup } from "solid-js";

// Component that rotates using the context ticker
const RotatingSprite = () => {
  const [rotation, setRotation] = createSignal(0);

  onTick((ticker) => {
    setRotation((r) => r + 0.01 * ticker.deltaTime);
  });

  return <Sprite texture={Texture.WHITE} rotation={rotation()} x={100} y={100} />;
};

export const DemoApp = () => {
  // Create a separate ticker for one scene graph branch.
  const slowTicker = new Ticker();
  slowTicker.speed = 0.5; // Half speed
  slowTicker.start();

  // The caller owns this externally-created ticker.
  onCleanup(() => {
    slowTicker.stop();
    slowTicker.destroy();
  });

  return (
    <PixiCanvas style={{ width: "100%", height: "100dvh" }}>
      <Container>
        {/* Uses the default canvas ticker */}
        <RotatingSprite />

        {/* Uses its own slower ticker */}
        <TickerProvider ticker={slowTicker}>
          <RotatingSprite />
        </TickerProvider>
      </Container>
    </PixiCanvas>
  );
};
