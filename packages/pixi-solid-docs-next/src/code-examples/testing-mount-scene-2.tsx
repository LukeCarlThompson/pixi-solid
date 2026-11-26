import { Container, Sprite } from "pixi-solid";
import { mountScene } from "pixi-solid/testing";
import { expect } from "vitest";

const { container, getByLabel, dispose } = mountScene(() => (
  <Container label="scene">
    <Sprite label="player" x={100} />
  </Container>
));

// Container is Pixi.Container — directly accessible
expect(container.label).toBe("scene");

// The bound query helper searches from the current root
expect(getByLabel("player").x).toBe(100);

dispose();
