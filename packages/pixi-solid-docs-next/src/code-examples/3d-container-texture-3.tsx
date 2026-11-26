import { Container, Text } from "pixi-solid";
import { createContainerTexture } from "pixi-solid-3d";
import { createEffect, createSignal } from "solid-js";
const [label, setLabel] = createSignal("Idle");

const panel = createContainerTexture(
  <Container>
    <Text text={label()} style={{ fontSize: 40 }} />
  </Container>,
  { width: 512, height: 128, autoUpdate: false },
);

// The first render already happened; redraw whenever the text changes.
createEffect(
  () => label(),
  () => panel.render(),
);
