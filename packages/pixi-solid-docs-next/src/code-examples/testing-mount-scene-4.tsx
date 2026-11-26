import { Container, onTick, Sprite } from "pixi-solid";
import { createTestContext } from "pixi-solid/testing";
import { expect } from "vitest";

const ctx = createTestContext();
let calls = 0;

const TickerCounter = () => {
  onTick(() => {
    calls++;
  });
  return <Sprite x={100} />;
};

ctx.mount(() => (
  <Container>
    <TickerCounter />
  </Container>
));

// The driver methods are async, so always await them
await ctx.ticker.fastForwardFrames(5);
expect(calls).toBe(5);
