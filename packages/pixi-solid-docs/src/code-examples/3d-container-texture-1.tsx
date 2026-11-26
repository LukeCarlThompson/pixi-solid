import { FlatMaterial, PlaneGeometry } from "@pixi/3d";
import { Container, Text } from "pixi-solid";
import { Mesh3D, createContainerTexture } from "pixi-solid-3d";

const label = createContainerTexture(
  <Container>
    <Text text="Now serving" style={{ fontSize: 48, fill: "#ffffff" }} />
  </Container>,
  { width: 512, height: 128 },
);

<Mesh3D
  geometry={new PlaneGeometry({ width: 4, height: 1 })}
  material={new FlatMaterial({ baseColorTexture: label })}
/>;
