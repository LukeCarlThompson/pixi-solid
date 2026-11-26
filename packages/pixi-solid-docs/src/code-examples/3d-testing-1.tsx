import { Container } from "pixi-solid";
import { Container3D, Mesh3D, View3D } from "pixi-solid-3d";
import { getByLabel3D } from "pixi-solid-3d/testing";
import { cleanup, mountScene } from "pixi-solid/testing";
import { expect } from "vitest";

const { container } = mountScene(() => (
  <Container label="hud">
    <Container label="score" />
    <View3D>
      <Container3D label="group">
        <Mesh3D label="crate" />
      </Container3D>
    </View3D>
  </Container>
));

expect(getByLabel3D(container, "score")).toBeDefined(); // 2D, beside the view
expect(getByLabel3D(container, "crate")).toBeDefined(); // 3D, inside the view

cleanup();
