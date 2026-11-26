import { FlatMaterial, Mesh3D as Mesh3DClass, PlaneGeometry } from "@pixi/3d";
import { PortalPass, PortalMaterial as PortalMaterialClass } from "@pixi/3d/extras";
import { Mesh3D, PortalMaterial, View3D } from "pixi-solid-3d";
import { RenderTexture } from "pixi.js";

const WIDTH = 800;
const HEIGHT = 600;

// 1. The feed, sized to the view.
const feed = RenderTexture.create({ width: WIDTH, height: HEIGHT, format: "rgba16float" });

// 2. Both quads. They must share a scale.
const geometry = new PlaneGeometry({ width: 3, height: 4 });
const entry = new Mesh3DClass({ geometry, material: new PortalMaterialClass({ texture: feed }) });
const exit = new Mesh3DClass({ geometry, material: new FlatMaterial() });
exit.position.set(60, 1, 0);

// 3. The pass, which needs both quads and the feed.
const portal = new PortalPass({ entry, exit, texture: feed });

<View3D width={WIDTH} height={HEIGHT} passes={[portal]}>
  <Mesh3D as={entry} />
  <Mesh3D as={exit} />
</View3D>;
